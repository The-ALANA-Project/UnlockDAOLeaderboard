import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { fetchAndStoreLeaderboardData } from "./tally_fetcher.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

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

// Health check endpoint
app.get("/make-server-ac91107f/health", (c) => {
  return c.json({ status: "ok" });
});

// Tally API proxy endpoint for proposals
app.post("/make-server-ac91107f/tally/proposals", async (c) => {
  try {
    const tallyApiKey = Deno.env.get('TALLY_API_KEY');
    if (!tallyApiKey) {
      console.error('TALLY_API_KEY environment variable not set');
      return c.json({ error: 'API key not configured' }, 500);
    }

    const body = await c.req.json();
    console.log('Proxying Tally proposals request:', body);

    const response = await fetchTallyWithRetry('https://api.withtally.com/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': tallyApiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tally API error:', response.status, errorText);
      return c.json({ error: `Tally API error: ${response.status}`, details: errorText }, response.status);
    }

    const data = await response.json();
    console.log('Tally API response:', JSON.stringify(data).substring(0, 200) + '...');
    
    return c.json(data);
  } catch (error) {
    console.error('Error proxying Tally proposals request:', error);
    return c.json({ error: 'Failed to fetch proposals from Tally API', details: error.message }, 500);
  }
});

// Tally API proxy endpoint for votes
app.post("/make-server-ac91107f/tally/votes", async (c) => {
  try {
    const tallyApiKey = Deno.env.get('TALLY_API_KEY');
    if (!tallyApiKey) {
      console.error('TALLY_API_KEY environment variable not set');
      return c.json({ error: 'API key not configured' }, 500);
    }

    const body = await c.req.json();
    console.log('Proxying Tally votes request:', body);

    const response = await fetchTallyWithRetry('https://api.withtally.com/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': tallyApiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tally API error:', response.status, errorText);
      return c.json({ error: `Tally API error: ${response.status}`, details: errorText }, response.status);
    }

    const data = await response.json();
    console.log('Tally API response:', JSON.stringify(data).substring(0, 200) + '...');
    
    return c.json(data);
  } catch (error) {
    console.error('Error proxying Tally votes request:', error);
    return c.json({ error: 'Failed to fetch votes from Tally API', details: error.message }, 500);
  }
});

// Get cached leaderboard data
app.get("/make-server-ac91107f/get-leaderboard", async (c) => {
  try {
    console.log('Fetching leaderboard data from KV store...');
    const data = await kv.get('voter_leaderboard_data');
    
    if (!data) {
      console.log('No leaderboard data found in cache');
      return c.json({ 
        error: 'No leaderboard data available yet. Please trigger a refresh.',
        cached: false 
      }, 404);
    }
    
    console.log('Successfully retrieved leaderboard data from cache');
    return c.json({
      success: true,
      cached: true,
      ...data,
    });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return c.json({ 
      error: 'Failed to fetch leaderboard data', 
      details: error.message 
    }, 500);
  }
});

// Manually trigger leaderboard refresh
app.post("/make-server-ac91107f/refresh-leaderboard", async (c) => {
  try {
    console.log('Manual refresh triggered');
    
    // Run the background fetch
    const result = await fetchAndStoreLeaderboardData();
    
    if (result.success) {
      return c.json({
        success: true,
        message: 'Leaderboard data refreshed successfully',
        data: result.data,
      });
    } else {
      return c.json({
        success: false,
        error: result.error,
      }, 500);
    }
  } catch (error) {
    console.error('Error refreshing leaderboard:', error);
    return c.json({ 
      error: 'Failed to refresh leaderboard data', 
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);