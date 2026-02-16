import * as kv from "./kv_store.tsx";
import { ethers } from "npm:ethers@6.13.0";

interface VoterData {
  address: string;
  ens_name?: string;
  proposals_voted: number;
  participation_rate: number;
  first_vote: string;
  last_vote: string;
}

interface LeaderboardData {
  voterData: VoterData[];
  totalProposals: number;
  lastUpdated: string;
  proposalsFetched: number;
}

const BASE_CHAIN_ID = 'eip155:8453'; // Base blockchain
const UNLOCK_GOVERNOR_ID = 'eip155:8453:0x65bA0624403Fc5Ca2b20479e9F626eD4D78E0aD9';

// GraphQL query for proposals
const PROPOSALS_QUERY = `
  query Proposals($input: ProposalsInput!) {
    proposals(input: $input) {
      nodes {
        ... on Proposal {
          id
          governor {
            id
            name
          }
          createdAt
        }
      }
    }
  }
`;

// GraphQL query for votes
const VOTES_QUERY = `
  query Votes($input: VotesInput!) {
    votes(input: $input) {
      nodes {
        ... on OnchainVote {
          id
          voter {
            address
          }
          type
          amount
          block {
            timestamp
          }
        }
      }
    }
  }
`;

// Utility function to add delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to retry Tally API calls with exponential backoff
async function fetchTallyWithRetry(url: string, options: any, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        const waitTime = Math.pow(2, i) * 3000; // 3s, 6s, 12s
        console.log(`Rate limited by Tally API. Waiting ${waitTime / 1000}s before retry ${i + 1}/${maxRetries}...`);
        await sleep(waitTime);
        continue;
      }
      
      return response;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      console.log(`Request failed, retrying... (${i + 1}/${maxRetries})`);
      await sleep(2000);
    }
  }
  throw new Error('Max retries reached');
}

export async function fetchAndStoreLeaderboardData(): Promise<{ success: boolean; error?: string; data?: LeaderboardData }> {
  try {
    console.log('=== Starting background leaderboard data fetch ===');
    
    const tallyApiKey = Deno.env.get('TALLY_API_KEY');
    if (!tallyApiKey) {
      throw new Error('TALLY_API_KEY environment variable not set');
    }

    // Fetch proposals
    console.log('Fetching proposals...');
    const proposalsResponse = await fetchTallyWithRetry('https://api.withtally.com/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': tallyApiKey,
      },
      body: JSON.stringify({
        query: PROPOSALS_QUERY,
        variables: {
          input: {
            filters: {
              governorId: UNLOCK_GOVERNOR_ID,
            },
            page: {
              limit: 10, // Fetching 10 proposals in background
            },
          },
        },
      }),
    });

    if (!proposalsResponse.ok) {
      const errorText = await proposalsResponse.text();
      throw new Error(`Failed to fetch proposals: ${proposalsResponse.status} - ${errorText}`);
    }

    const proposalsData = await proposalsResponse.json();

    if (proposalsData.errors) {
      throw new Error(`GraphQL Error: ${proposalsData.errors[0].message}`);
    }

    const proposals = proposalsData.data.proposals.nodes;
    
    if (!proposals || proposals.length === 0) {
      throw new Error('No proposals found');
    }

    const proposalIds = proposals.map((proposal: any) => proposal.id);
    console.log(`Found ${proposalIds.length} proposals, fetching votes...`);

    // Fetch votes for each proposal
    const voterMap = new Map<string, {
      proposalIds: Set<string>;
      firstVote: string;
      lastVote: string;
    }>();

    for (let i = 0; i < proposalIds.length; i++) {
      const proposalId = proposalIds[i];
      console.log(`Fetching votes for proposal ${i + 1}/${proposalIds.length}: ${proposalId}...`);
      
      // Add 4 second delay between requests
      if (i > 0) {
        console.log('Waiting 4 seconds before next request...');
        await sleep(4000);
      }
      
      const votesResponse = await fetchTallyWithRetry('https://api.withtally.com/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': tallyApiKey,
        },
        body: JSON.stringify({
          query: VOTES_QUERY,
          variables: {
            input: {
              filters: {
                proposalId: proposalId,
              },
            },
          },
        }),
      });

      if (!votesResponse.ok) {
        const errorText = await votesResponse.text();
        console.error(`Failed to fetch votes for proposal ${proposalId}: ${votesResponse.status} - ${errorText}`);
        continue; // Skip this proposal but continue with others
      }

      const votesData = await votesResponse.json();

      if (votesData.errors) {
        console.error(`GraphQL Error for proposal ${proposalId}:`, votesData.errors[0].message);
        continue;
      }

      const votes = votesData.data.votes.nodes;
      
      if (!votes || votes.length === 0) {
        console.log(`No votes found for proposal ${proposalId}`);
        continue;
      }

      console.log(`Processing ${votes.length} votes for proposal ${proposalId}`);

      votes.forEach((vote: any) => {
        const address = vote.voter.address;
        const createdAt = vote.block.timestamp;

        if (!voterMap.has(address)) {
          voterMap.set(address, {
            proposalIds: new Set([proposalId]),
            firstVote: createdAt,
            lastVote: createdAt,
          });
        } else {
          const voterInfo = voterMap.get(address)!;
          voterInfo.proposalIds.add(proposalId);
          
          if (new Date(createdAt) < new Date(voterInfo.firstVote)) {
            voterInfo.firstVote = createdAt;
          }
          if (new Date(createdAt) > new Date(voterInfo.lastVote)) {
            voterInfo.lastVote = createdAt;
          }
        }
      });
    }

    console.log(`Processed ${voterMap.size} unique voters`);

    // Convert to array and calculate participation rate
    const voterDataArray: VoterData[] = Array.from(voterMap.entries()).map(([address, info]) => ({
      address,
      proposals_voted: info.proposalIds.size,
      participation_rate: proposalIds.length > 0 
        ? (info.proposalIds.size / proposalIds.length) * 100 
        : 0,
      first_vote: new Date(info.firstVote).toLocaleDateString(),
      last_vote: new Date(info.lastVote).toLocaleDateString(),
    }));

    // Sort by proposals voted (descending)
    voterDataArray.sort((a, b) => b.proposals_voted - a.proposals_voted);

    // Resolve ENS names for all addresses
    console.log('Resolving ENS names for voter addresses...');
    await resolveENSNames(voterDataArray);

    // Prepare data to store
    const leaderboardData: LeaderboardData = {
      voterData: voterDataArray,
      totalProposals: proposalIds.length,
      lastUpdated: new Date().toISOString(),
      proposalsFetched: proposalIds.length,
    };

    // Store in KV
    console.log('Storing leaderboard data in KV store...');
    await kv.set('voter_leaderboard_data', leaderboardData);
    
    console.log('=== Successfully fetched and stored leaderboard data ===');
    
    return {
      success: true,
      data: leaderboardData,
    };

  } catch (error) {
    console.error('Error in fetchAndStoreLeaderboardData:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Function to resolve ENS names for voter addresses
async function resolveENSNames(voterDataArray: VoterData[]) {
  try {
    const alchemyApiKey = Deno.env.get('ALCHEMY_API_KEY');
    if (!alchemyApiKey) {
      console.warn('ALCHEMY_API_KEY not set, skipping ENS resolution');
      return;
    }

    // ENS is on Ethereum mainnet, not Base
    const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`);
    
    console.log(`Resolving ENS names for ${voterDataArray.length} addresses...`);
    let resolvedCount = 0;

    for (let i = 0; i < voterDataArray.length; i++) {
      const voter = voterDataArray[i];
      try {
        // Add small delay to avoid rate limiting
        if (i > 0 && i % 5 === 0) {
          await sleep(500); // 500ms delay every 5 requests
        }

        const ensName = await provider.lookupAddress(voter.address);
        if (ensName) {
          voter.ens_name = ensName;
          resolvedCount++;
          console.log(`Resolved ${voter.address} -> ${ensName}`);
        }
      } catch (error) {
        // Silently skip addresses that don't have ENS names or fail to resolve
        console.log(`No ENS name for ${voter.address}`);
      }
    }

    console.log(`Successfully resolved ${resolvedCount}/${voterDataArray.length} ENS names`);
  } catch (error) {
    console.error('Error during ENS resolution:', error);
    // Don't fail the whole process if ENS resolution fails
  }
}