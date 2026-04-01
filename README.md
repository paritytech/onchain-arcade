# Tick-Tack-Toe

> A real-time multiplayer Tic-Tac-Toe dApp built on Polkadot Asset Hub (Paseo testnet).

## Features

- **Create & Share Games**: Generate a unique 6-character game code and share it with an opponent
- **Real-Time Gameplay**: Turn-based play with live updates on each new block (~2s on Asset Hub)
- **Win Detection**: Automatic detection of all 8 winning lines plus draw condition
- **Leaderboard**: Auto-computed rankings by wins across all finished games
- **Cross-Tab Sync**: BroadcastChannel keeps game state in sync across multiple browser tabs
- **Wallet Integration**: Connect via Talisman, SubWallet, or Nova Wallet; auto-connect in Triangle/Spektr host
- **Game History**: Browse all games (waiting, in progress, finished) with search and filtering
- **Dark Mode**: Persistent theme toggle with Tailwind dark mode
- **Responsive Design**: Mobile-first with hamburger menu navigation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Polkadot Asset Hub - Paseo testnet
- **Wallet Integration**: Talisman, SubWallet, Nova Wallet (via @talismn/connect-wallets)
- **Chain Client**: Polkadot API (PAPI) singleton at `src/lib/papi/client.ts`
- **State Management**: React Context API (useState)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- A Polkadot-compatible wallet browser extension (Talisman, SubWallet, or Nova Wallet)
- Paseo testnet tokens for gas fees (optional - game logic runs locally)

## Installation

```bash
git clone <repository-url>
cd Tick-tack-toe
npm install --include=dev
cp .env.example .env
```

## Environment Variables

```bash
VITE_RPC_URL=wss://asset-hub-paseo-rpc.n.dwellir.com
VITE_RPC_FALLBACK_1=wss://sys.ibp.network/asset-hub-paseo
VITE_RPC_FALLBACK_2=wss://pas-rpc.stakeworld.io/assethub
VITE_RPC_FALLBACK_3=wss://asset-hub-paseo-rpc.dwellir.com
VITE_CONTRACT_ADDRESS=   # Leave empty for local-state mode
VITE_NETWORK=paseo-asset-hub
VITE_CHAIN_ID=420420417
```

The app works without a `.env` file — it uses built-in RPC fallbacks and local state.

## Running Locally

```bash
npm run dev
# Open http://localhost:5173
```

## Building for Production

```bash
npm run build
```

Output is in `dist/`. Deploy to any static host (Vercel, Netlify, IPFS, etc.).

## How to Play

1. **Connect your wallet** via the button in the top-right header
2. **Create a game** on the Home page — you'll get a 6-character game code
3. **Share the code** with your opponent
4. **Opponent joins** by entering the code on the Home page
5. **Take turns** clicking cells on the game board
6. **Win** by getting 3 in a row (horizontal, vertical, or diagonal)

## Architecture

- **Hybrid State**: Games stored in `localStorage` with `BroadcastChannel` for cross-tab sync; ready for on-chain migration
- **Block-Driven Updates**: `useOnBlock()` subscribes to new Polkadot blocks for real-time refresh
- **Dual-Mode Wallet**: Auto-connect in Triangle/Spektr host environment; manual connect in standalone browser

## Wallet Integration

Pre-scaffolded via `src/contexts/WalletContext.tsx`:
- **Talisman**: Full substrate wallet support
- **SubWallet**: Multi-chain wallet
- **Nova Wallet**: Mobile-first Polkadot wallet
- **Triangle Host** (Spektr): Auto-connect with no user action required

## Troubleshooting

**Wallet won't connect**
- Ensure you have a supported wallet extension installed
- Refresh the page and try again
- Check browser console for extension errors

**Game not updating**
- Ensure the PAPI client connected to the RPC endpoint (check console)
- Try a different RPC in `.env` (VITE_RPC_FALLBACK_1, etc.)

**Opponent moves not showing**
- Both players must be on the same browser session or share the game ID
- In a real deployment, the game code routes both players to the same game URL

**Page not found on refresh**
- The app uses Hash routing (`/#/play?game=XYZ`) so deep links work on any static host

## License

MIT
