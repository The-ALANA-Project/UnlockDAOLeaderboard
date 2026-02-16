# Unlock DAO Voter Leaderboard

This page was developed to track voter participation within Unlock Protocol DAO. The leaderboard extracts the last ten proposals from the Unlock Protocol Tally governance board and displays the most active voters utilizing the native API.

## Features

- **Real-time Governance Tracking** - Fetches voting data from Tally.xyz for Unlock Protocol proposals
- **Leaderboard Rankings** - Displays voters ranked by participation rate and proposal activity
- **ENS Resolution** - Automatically resolves wallet addresses to ENS names using Alchemy API
- **Participation Metrics** - Shows proposals voted, participation rate, first vote, and last vote dates
- **Cached Data** - Uses Supabase KV store for fast loading with scheduled background updates
- **CSV Export** - Export leaderboard data including ENS names
- **Unlock Protocol Branding** - Maintains official brand colors and styling

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS v4
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **Database**: Supabase KV Store
- **APIs**: 
  - Tally.xyz GraphQL API
  - Alchemy API (for ENS resolution)
  - Ethers.js v6

## Project Structure

```
/
├── App.tsx                           # Main application entry point
├── components/
│   ├── VoterLeaderboard.tsx         # Main leaderboard component
│   ├── Header.tsx                   # Site header
│   ├── Footer.tsx                   # Site footer
│   └── ui/                          # UI component library
├── supabase/functions/server/
│   ├── index.tsx                    # Hono web server & API routes
│   ├── tally_fetcher.tsx           # Tally API fetching & ENS resolution
│   └── kv_store.tsx                # KV store utilities (protected)
└── styles/
    └── globals.css                  # Global styles & Unlock brand tokens
```

## API Endpoints

### GET `/make-server-ac91107f/get-leaderboard`
Retrieves cached leaderboard data from KV store.

**Response:**
```json
{
  "success": true,
  "voterData": [...],
  "totalProposals": 26,
  "lastUpdated": "2025-02-16T12:00:00Z"
}
```

### POST `/make-server-ac91107f/refresh-leaderboard`
Manually triggers a data refresh, fetching latest proposals and votes from Tally.

**Response:**
```json
{
  "success": true,
  "message": "Leaderboard data refreshed successfully",
  "data": { ... }
}
```

## Configuration

### Environment Variables

The following secrets are required (already configured):

- `TALLY_API_KEY` - Your Tally.xyz API key
- `ALCHEMY_API_KEY` - Your Alchemy API key for ENS resolution
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### Governance Configuration

Edit `/supabase/functions/server/tally_fetcher.tsx` to change:

```typescript
const GOVERNANCE_ID = "2206072050315953179"; // Unlock Protocol
const GOVERNOR_ADDRESS = "0x65bA0624403Fc5Ca2b20479e9F626eD4D78E0aD9";
const CHAIN_ID = "eip155:8453"; // Base blockchain
const MIN_PROPOSALS = 10; // Minimum proposals to fetch
```

## How It Works

### Data Flow

1. **Scheduled Job** (every 4 hours):
   - Backend fetches last 10+ proposals from Tally API
   - Fetches all votes for each proposal
   - Aggregates data by voter address
   - Resolves ENS names via Alchemy + ethers.js
   - Stores in KV store: `voter_leaderboard_data`

2. **Frontend Display**:
   - Loads cached data from `/get-leaderboard`
   - Displays ENS names (purple) or truncated addresses
   - Shows participation metrics and rankings
   - Provides manual refresh button

### ENS Resolution

- Uses ethers.js v6 `JsonRpcProvider` with Alchemy
- Rate-limited to 1 request per second
- Graceful fallbacks if resolution fails
- Cached with leaderboard data

### Rate Limiting

- Smart exponential backoff for Tally API (429 errors)
- Retry logic: 3s, 6s, 12s delays
- ENS resolution: 1 req/sec with delays

## Brand Colors

```css
--protocol-peri: #B19EFA;    /* Primary purple */
--genesis-ink: #020207;       /* Near black */
--open-canvas: #F7F8F9;       /* Light background */
--terminal-grey: #4A4A4A;     /* Medium grey */
--node-night: #1A1A1A;        /* Dark grey */
--consensus-cream: #FFF8E7;   /* Accent cream */
```

## Design System

- **Font**: Inter (sans-serif)
- **Border Radius**: 15px (buttons, cards)
- **Top Rounding**: Cards use `rounded-t-[15px] rounded-b-none`
- **Hover States**: Smooth transitions with Protocol Peri purple

## Data Displayed

| Column | Description |
|--------|-------------|
| Rank | Position with medals for top 3 (🥇🥈🥉) |
| Voter Address | ENS name or truncated address with copy button |
| Proposals Voted | Total number of proposals voted on |
| Participation Rate | Percentage with progress bar |
| First Vote | Date of first recorded vote |
| Last Vote | Date of most recent vote |

## Testing ENS Resolution

No need to wait 4 hours! Use the **"Refresh Data"** button at the bottom of the leaderboard to trigger an immediate data refresh with ENS resolution.

**Check the console** (F12) to see:
- ENS resolution logs
- API call details
- Any errors or warnings

## CSV Export

Click "Export to CSV" to download a spreadsheet with all leaderboard data including:
- Full wallet addresses
- ENS names (if available)
- All participation metrics

## Governance Links

- **Tally Governance**: https://www.tally.xyz/gov/unlock-protocol/
- **Base Blockchain**: Chain ID 8453
- **Governor Contract**: `0x65bA0624403Fc5Ca2b20479e9F626eD4D78E0aD9`

## Development Notes

- Frontend uses `/utils/supabase/info.tsx` for Supabase config
- Backend logs available in Supabase Dashboard → Edge Functions → Logs
- KV store key: `voter_leaderboard_data`
- Scheduled refresh: Every 4 hours (configurable in Supabase cron)

## Future Enhancements

- [ ] Add filtering by date range
- [ ] Display vote choices (For/Against/Abstain)
- [ ] Show voting power/token holdings
- [ ] Add proposal details modal
- [ ] Historical participation trends chart

## License

Built for Unlock Protocol DAO governance transparency.

---

**Need help?** Check the Supabase logs for detailed error messages and ENS resolution status.
