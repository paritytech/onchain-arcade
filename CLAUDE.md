# Tick-Tack-Toe - CLAUDE.md

> This file provides context for AI assistants working with this codebase.

## Project Overview

A real-time multiplayer Tic-Tac-Toe dApp on Polkadot Asset Hub (Paseo testnet). Players create games, share 6-character game codes, and play turn-based Tic-Tac-Toe with live blockchain-driven updates.

## Environment Setup

When starting Node.js projects, always check `.nvmrc` or `engines` field in `package.json` first. Use `nvm use` or the explicit nvm node binary path rather than relying on shell nvm propagation.

**Important**: This project's environment has `npm` configured to omit `devDependencies` by default. Always install with `--include=dev`:
```bash
npm install --include=dev
```

## Architecture

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom theme tokens
- **Blockchain**: Polkadot Asset Hub - Paseo testnet
- **Wallet Integration**: Talisman, SubWallet, Nova Wallet via @talismn/connect-wallets
- **Chain Client**: PAPI singleton at `src/lib/papi/client.ts` (dual-mode: Triangle host or standalone WebSocket)
- **State Management**: React Context API (useState) — GameContext + WalletContext
- **Game State**: localStorage + BroadcastChannel for cross-tab sync
- **Real-Time Updates**: `useOnBlock` hook subscribes to block events (~2s on Asset Hub)
- **Icons**: Lucide React (use `aria-label` for accessibility, NOT `title`)
- **Animations**: Framer Motion for game board cell animations

## Directory Structure

```
src/
├── components/
│   ├── ui/                    # Base UI: Button, Card, Badge, Input, Modal, LoadingSpinner, Skeleton
│   ├── GameBoard.tsx          # 3x3 animated game grid
│   ├── Sidebar.tsx            # Nav sidebar (desktop fixed + mobile hamburger drawer)
│   ├── Header.tsx             # Top bar with wallet button + theme toggle
│   ├── WalletModal.tsx        # Wallet selection modal
│   └── ErrorBoundary.tsx      # React error boundary
├── contexts/
│   ├── GameContext.tsx        # Game CRUD, move logic, win detection, leaderboard
│   ├── WalletContext.tsx      # Wallet connection (dual-mode: Triangle host / standalone)
│   ├── WalletProvider.tsx     # Wraps WalletContext
│   ├── ThemeContext.tsx       # Dark/light theme toggle
│   └── NotificationProvider.tsx # Toast notification system
├── hooks/
│   ├── useOnBlock.ts          # Block event subscription for real-time refresh
│   └── useContractPAPI.ts     # Base hook for Ink contract interaction
├── lib/
│   ├── papi/client.ts         # PAPI singleton (getPAPIClient, ss58ToH160, disconnectPAPIClient)
│   ├── contracts/
│   │   ├── config.ts          # RPC endpoints, contract address from env
│   │   └── abi.ts             # Contract ABI (empty until deployed)
│   ├── triangle/              # Triangle host detection logic
│   ├── statementStore.ts      # Event-sourced game state backed by Statement Store RPC
│   ├── statementStoreRpc.ts   # WebSocket JSON-RPC client for Substrate Statement Store
│   ├── scale.ts               # Minimal SCALE codec for Statement Store fields
│   ├── gameRelay.ts           # WebSocket relay client (fallback for cross-browser sync)
│   ├── animation-variants.ts  # Framer motion configs
│   ├── utils.ts               # cn(), truncateAddress(), formatBalance()
│   └── storage.ts             # localStorage wrapper
├── pages/
│   ├── HomePage.tsx           # Create/join game, stats, recent games
│   ├── GamePage.tsx           # Active game board with real-time updates
│   ├── GamesListPage.tsx      # Browse all games with search + filter
│   └── LeaderboardPage.tsx    # Player rankings by wins
├── types/
│   └── game.ts                # Game types, EMPTY_BOARD, WINNING_LINES, checkWinner(), generateGameId()
├── App.tsx                    # Root: HashRouter with 4 routes + provider stack
└── main.tsx                   # Entry point
```

## Key Patterns

### Provider Order (Critical)
```
ErrorBoundary > ThemeProvider > NotificationProvider > WalletProvider > GameProvider > Router
```
ThemeProvider MUST be outermost. NotificationProvider MUST wrap WalletProvider.

### Routing
Uses `HashRouter` (react-router-dom v7) for static hosting compatibility.
- `/` → HomePage
- `/play?game=GAMEID` → GamePage
- `/games` → GamesListPage
- `/leaderboard` → LeaderboardPage

### Cross-Browser Multiplayer (Statement Store)
Game state syncs across browsers via the **Substrate Statement Store RPC** (`wss://pop3-testnet.parity-lab.parity.io/people`).
- **Statement Store**: Each game action (create, join, move) is an immutable statement submitted to the on-chain statement store
- **Real-time sync**: Clients subscribe via `statement_subscribeStatement` for push-based updates (~RTT latency)
- **SCALE encoding**: `src/lib/scale.ts` handles encoding/decoding Statement Store fields (topics, data, proof)
- **Signing**: Statements are signed with the wallet's sr25519 key via `signRaw`
- **Topics**: App topic = keccak256("ttt-game"), Game topic = keccak256("ttt:{GAMEID}")
- **Local cache**: localStorage caches statements for offline access; Statement Store is the source of truth
- **Fallback relay**: `server/relay.js` + `src/lib/gameRelay.ts` available as WebSocket fallback (`npm run relay`)
- **Share links**: Include `&host=ADDRESS` param so the other browser can bootstrap the game
- **Without relay**: Games still work within the same browser (localStorage + BroadcastChannel)

### Real-Time Updates
Game state updates are **push-based** via Statement Store subscription (`statement_subscribeStatement`).
`useOnBlock` is available for chain queries but NOT used for game state polling.
The `statementStore` uses `useSyncExternalStore` for zero-lag React re-renders.

### Game State Flow (Event-Sourced)
1. `createGame()` → creates `create_game` statement → applies locally + submits to Statement Store RPC
2. `joinGame(id)` → creates `join_game` statement → applies locally + submits to Statement Store RPC
3. `makeMove(gameId, cellIndex)` → creates `make_move` statement → applies locally + submits to Statement Store RPC
4. Game state is **derived** by replaying all statements for a game in order (event sourcing)

### Wallet Context API
```typescript
const { isConnected, address, connect, disconnect, selectAccount, getSigner, getSignRaw, getPublicKey } = useWallet();
```

### Modal Positioning
All modals use `fixed inset-0 z-50 flex items-center justify-center`.

## Development

```bash
npm install --include=dev    # Install ALL deps (devDeps omitted by default in this env)
npm run relay                # Start game relay for cross-browser multiplayer (ws://localhost:4001)
npm run dev                  # Dev server at http://localhost:5173
npm run build                # tsc + vite build → dist/
npx tsc --noEmit             # Type check only
```

## Environment Variables

See `.env.example`. The app works without a `.env` file — RPC fallbacks and local state are hardcoded as defaults.

## Styling

- Tailwind CSS with custom color tokens: `bg-bg`, `bg-surface`, `text-text`, `border-border`
- Dark mode enabled via `class="dark"` on `<html>` (persisted in localStorage)
- Never use emojis in UI — use Lucide React icons

## Debugging Guidelines

When debugging, trace ALL code paths that can trigger the behavior:
- Check both automatic (block subscription) and manual triggers (button clicks)
- Verify localStorage state is consistent across tabs (BroadcastChannel sync)
- Game moves require `isConnected` wallet — test both connected and disconnected states
- PAPI client initialization is async; check `isPAPIClientReady()` before queries

## Common Tasks

- **Add a new page**: Create in `src/pages/`, add route in `App.tsx`
- **Add a component**: Create in `src/components/`
- **Add wallet interaction**: Use `useWallet()` from `WalletContext`
- **Add contract call**: Extend `useContractPAPI` base hook
- **Add an icon**: Import from `lucide-react`, always include `aria-label`
- **Add a notification**: Use `useNotification()` from `NotificationProvider`

## Known Constraints

- Lucide icons: Use `aria-label`, NOT `title`
- Modals: Must use `fixed inset-0` positioning
- No emojis in UI
- Wallet required before making moves (game creation/join works without wallet)
- `npm install` without `--include=dev` will skip TypeScript types in this environment
