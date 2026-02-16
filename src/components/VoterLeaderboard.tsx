import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Calendar, TrendingUp, Award, RefreshCw, Copy, Check } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface VoterData {
  address: string;
  ens_name?: string;
  proposals_voted: number;
  participation_rate: number;
  first_vote: string;
  last_vote: string;
}

export function VoterLeaderboard() {
  const [voterData, setVoterData] = useState<VoterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProposals, setTotalProposals] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchVoterData();
  }, []);

  const copyToClipboard = async (address: string) => {
    // Use the fallback method directly since Clipboard API is blocked
    try {
      const textArea = document.createElement('textarea');
      textArea.value = address;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopiedAddress(address);
        setTimeout(() => setCopiedAddress(null), 2000);
      }
    } catch (err) {
      // Silently fail - user will just not see the checkmark
      console.log('Copy failed, but user can still select text manually');
    }
  };

  const fetchVoterData = async () => {
    try {
      setLoading(true);
      setError(null);

      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-ac91107f`;

      console.log('Fetching cached leaderboard data...');

      // Fetch from cache
      const response = await fetch(`${serverUrl}/get-leaderboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('Response status:', response.status);

      if (response.status === 404) {
        // No cached data, need to trigger initial refresh
        console.log('No cached data found, triggering initial refresh...');
        await triggerRefresh();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Leaderboard data:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch leaderboard data');
      }

      setVoterData(data.voterData);
      setTotalProposals(data.totalProposals);
      setLastUpdated(data.lastUpdated);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching voter data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch voter data';
      
      setError(errorMessage);
      
      // Use mock data for demonstration
      const mockData: VoterData[] = [
        {
          address: '0x1234...5678',
          proposals_voted: 24,
          participation_rate: 92.3,
          first_vote: '8/15/2024',
          last_vote: '2/10/2025',
        },
        {
          address: '0xabcd...efgh',
          proposals_voted: 22,
          participation_rate: 84.6,
          first_vote: '9/1/2024',
          last_vote: '2/9/2025',
        },
        {
          address: '0x9876...4321',
          proposals_voted: 20,
          participation_rate: 76.9,
          first_vote: '8/20/2024',
          last_vote: '2/8/2025',
        },
      ];
      
      setVoterData(mockData);
      setTotalProposals(26);
      setLoading(false);
    }
  };

  const triggerRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-ac91107f`;

      console.log('Triggering manual refresh...');

      const response = await fetch(`${serverUrl}/refresh-leaderboard`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Refresh failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Refresh response:', data);

      if (data.success) {
        setVoterData(data.data.voterData);
        setTotalProposals(data.data.totalProposals);
        setLastUpdated(data.data.lastUpdated);
        setLoading(false);
      } else {
        throw new Error(data.error || 'Refresh failed');
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const exportToCSV = () => {
    const headers = ['address', 'ens_name', 'proposals_voted', 'participation_rate', 'first_vote', 'last_vote'];
    const csvContent = [
      headers.join(','),
      ...voterData.map(row => 
        `${row.address},${row.ens_name || ''},${row.proposals_voted},${row.participation_rate.toFixed(2)},${row.first_vote},${row.last_vote}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unlock-voter-leaderboard.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Award className="w-5 h-5 text-[#FFD700]" />;
    if (index === 1) return <Award className="w-5 h-5 text-[#C0C0C0]" />;
    if (index === 2) return <Award className="w-5 h-5 text-[#CD7F32]" />;
    return null;
  };

  const formatDateWithShortYear = (dateStr: string) => {
    // Convert dates like "8/15/2024" to "8/15/24" or "2/10/2025" to "2/10/25"
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const year = parts[2];
      const shortYear = year.slice(-2); // Get last 2 digits
      return `${parts[0]}/${parts[1]}/${shortYear}`;
    }
    return dateStr;
  };

  if (loading) {
    return (
      <section className="py-20 px-6 bg-protocol-peri">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-open-canvas"></div>
            <p className="mt-4 text-open-canvas">Loading voter data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-protocol-peri">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 py-6 px-6">
          <h2 className="text-[40px] font-bold text-genesis-ink mx-[0px] mt-[45px] mb-[12px]">
            Governance Leaderboard
          </h2>
          <p className="text-lg text-terminal-grey max-w-3xl mx-auto mb-6">
            Track the most active participants in Unlock Protocol governance. 
            Showing data from the last 10 proposals on Tally.xyz
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="bg-open-canvas rounded-t-[15px] rounded-b-none px-6 py-4 shadow-sm border border-protocol-peri/20">
              <div className="text-2xl font-bold text-protocol-peri">{voterData.length}</div>
              <div className="text-sm text-terminal-grey">Active Voters</div>
            </div>
            <div className="bg-open-canvas rounded-t-[15px] rounded-b-none px-6 py-4 shadow-sm border border-protocol-peri/20">
              <div className="text-2xl font-bold text-protocol-peri">{totalProposals}</div>
              <div className="text-sm text-terminal-grey">Total Proposals</div>
            </div>
          </div>

          {error && (
            <div className="bg-open-canvas border border-protocol-peri/30 rounded-t-[15px] rounded-b-none p-4 mb-4 max-w-2xl mx-auto">
              <p className="text-terminal-grey text-sm">
                <strong>Note:</strong> Using demo data. {error}
              </p>
              <p className="text-terminal-grey text-sm mt-2">
                To fetch live data, add your Tally API key in the VoterLeaderboard component.
              </p>
            </div>
          )}

          <button
            onClick={exportToCSV}
            className="bg-open-canvas text-protocol-peri px-6 py-3 rounded-[15px] font-medium hover:bg-protocol-peri hover:text-open-canvas border-2 border-open-canvas transition-all duration-300 text-[#020207]"
          >
            Export to CSV
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-open-canvas rounded-t-[15px] rounded-b-none shadow-lg overflow-hidden border border-protocol-peri/20">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-protocol-peri/10 border-b border-protocol-peri/20">
                  <TableHead className="text-genesis-ink font-semibold py-4">Rank</TableHead>
                  <TableHead className="text-genesis-ink font-semibold">Voter Address</TableHead>
                  <TableHead className="text-genesis-ink font-semibold text-center">
                    Proposals Voted
                  </TableHead>
                  <TableHead className="text-genesis-ink font-semibold text-left">
                    Participation Rate
                  </TableHead>
                  <TableHead className="text-genesis-ink font-semibold text-left">
                    First Vote
                  </TableHead>
                  <TableHead className="text-genesis-ink font-semibold text-left">
                    Last Vote
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voterData.map((voter, index) => (
                  <TableRow 
                    key={voter.address} 
                    className="hover:bg-protocol-peri/5 transition-colors border-b border-protocol-peri/10"
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center gap-2">
                        {getRankBadge(index)}
                        <span className="text-genesis-ink">#{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {voter.ens_name ? (
                        <span className="text-sm font-semibold text-protocol-peri" title={voter.address}>
                          {voter.ens_name}
                        </span>
                      ) : (
                        <code className="text-sm bg-protocol-peri/10 px-2 py-1 rounded text-genesis-ink font-mono" title={voter.address}>
                          {voter.address.slice(0, 6)}...{voter.address.slice(-4)}
                        </code>
                      )}
                      <button
                        onClick={() => copyToClipboard(voter.address)}
                        className="ml-2 text-sm text-genesis-ink hover:text-protocol-peri transition-colors"
                      >
                        {copiedAddress === voter.address ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className="bg-node-night/10 text-node-night border-node-night/30 font-semibold"
                      >
                        {voter.proposals_voted}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-genesis-ink font-semibold">
                          {voter.participation_rate.toFixed(1)}%
                        </span>
                        <div className="w-full max-w-[100px] bg-protocol-peri/20 rounded-full h-2">
                          <div 
                            className="bg-protocol-peri h-2 rounded-full transition-all"
                            style={{ width: `${voter.participation_rate}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-left text-terminal-grey">
                      {formatDateWithShortYear(voter.first_vote)}
                    </TableCell>
                    <TableCell className="text-left text-terminal-grey">
                      {formatDateWithShortYear(voter.last_vote)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center py-4 px-6">
          <p className="text-sm text-open-canvas">
            Data sourced from{' '}
            <a 
              href="https://www.tally.xyz/gov/unlock-protocol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-open-canvas hover:text-consensus-cream underline font-semibold"
            >
              Tally.xyz - Unlock Protocol
            </a>
          </p>
          {lastUpdated && (
            <p className="text-xs text-open-canvas/80 mt-2">
              Last updated: {getTimeAgo(lastUpdated)}
            </p>
          )}
          <button
            onClick={triggerRefresh}
            className="mt-4 bg-open-canvas text-protocol-peri px-6 py-2 rounded-[15px] font-medium hover:bg-protocol-peri hover:text-open-canvas border-2 border-open-canvas transition-all duration-300 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </section>
  );
}