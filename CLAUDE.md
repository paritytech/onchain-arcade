# Tick-Tack-Toe - CLAUDE.md

> This file provides context for AI assistants working with this codebase.

## Project Overview

A real-time multiplayer Tic-Tac-Toe dApp on Polkadot Asset Hub (Paseo testnet). Players create games, share 6-character game codes, and play turn-based Tic-Tac-Toe with live blockchain-driven updates.

## Environment Setup

**Node 22** (`.nvmrc`). The `@parity/product-sdk` stack pulls `@noble/*` v2, which
declares `node >= 20.19`; Node 18 installs with `EBADENGINE` warnings and is not
supported. Use `nvm use` or the explicit nvm binary path (`~/.nvm/versions/node/v22.*/bin/node`)
rather than relying on shell nvm propagation.

**Important**: This project's environment has `npm` configured to omit `devDependencies` by default. Always install with `--include=dev`:
```bash
npm install --include=dev
```

## Architecture

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom theme tokens
- **Blockchain**: Polkadot Asset Hub - Paseo testnet
- **Host SDK**: `@parity/product-sdk` 0.29.0 (host 0.21.0, `@parity/truapi` pinned to 0.17.0 — see the `overrides` note in `package.json`). Versions track `../spotlight-mesh`.
- **Wallet Integration**: host product account (Desktop / Mobile / browser shell); Talisman, SubWallet, Nova via @talismn/connect-wallets in a plain browser tab
- **Chain Client**: PAPI v2 singleton at `src/lib/papi/client.ts` (dual-mode: `getHostProvider(genesis)` in a host, direct WebSocket standalone)
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
│   ├── deadline.ts            # withDeadline/DEADLINE — bounds every host-bridge call
│   ├── host/                  # Host-SDK plumbing (host containers only)
│   │   ├── productIdentifier.ts # DotNS identifier derived from window.location
│   │   ├── hostError.ts       # Unwraps Domain→V1→variant host error envelopes
│   │   ├── allocation.ts      # RFC-0010 requestResourceAllocation, outcomes by tag
│   │   ├── allowance.ts       # StatementStoreAllowance + StatementSubmit grants
│   │   └── expiry.ts          # (expiry << 32 | sequence) packing + priority floor
│   ├── voice/                 # 1-to-1 WebRTC audio
│   │   ├── VoiceSession.ts    # One call: RTCPeerConnection + 3-statement handshake
│   │   └── sdpSeal.ts         # X25519 sealed box — SDP must never travel in clear
│   ├── webrtc/
│   │   ├── iceConfig.ts       # STUN + TURN, env-overridable
│   │   └── microphone.ts      # Host-mediated mic permission + capture + level meter
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

Game state syncs across devices through the Substrate Statement Store. Which
transport carries it depends on where the app is running, and the two must not
be confused — `statementStore.connectRpc(mode, hostSigningReady)` picks one.

| | Host container (Desktop / Mobile / browser shell) | Standalone browser tab |
|---|---|---|
| Module | `statementStoreHost.ts` | `statementStoreRpc.ts` |
| Transport | `getStatementStore()` over the host bridge | raw WebSocket JSON-RPC |
| Signing | `createProofAuthorized()` — the host picks its own allowance-bearing account | app's own sr25519 key (`statementSigner.ts`) |
| Prerequisite | RFC-0010 `StatementStoreAllowance` + `StatementSubmit` permission (`lib/host/allowance.ts`) | none |
| Wire types | topics/data/proof are **hex strings** | SCALE bytes (`lib/scale.ts`) |

- **Topics**: Blake2-256 of `ttt-game` (app) and `ttt:{GAMEID}` (per game).
- **Mode comes from the wallet**, never re-derived — `WalletContext` settles it
  with the SDK's async `isInsideContainer()` handshake. A second synchronous
  guess can disagree on a framed page with no bridge, which strands the app
  waiting for a host account that never arrives.
- **Expiry** is `(unix_secs + ttl) << 32 | sequence`. The sequence word is
  load-bearing: two statements in the same second otherwise encode identically
  and the store rejects the second as `channelPriorityTooLow`.
- **Local cache**: localStorage plus BroadcastChannel for cross-tab sync; the
  Statement Store is the source of truth.
- **Share links**: include `&host=ADDRESS` so the other device can bootstrap.

### Voice (1-to-1 WebRTC audio)

Two players in a match can open a direct audio channel. Signalling rides the
SAME Statement Store topic as moves — the two parties to a call are exactly the
two players — but voice statements are **not** game history and never enter the
statement log (`statementStore` branches them at `isVoiceStatement` before
ingestion; replaying an SDP blob into the deriver would be both wasteful and
wrong).

Three statements per call, because the SDP must be sealed to a key the sealer
does not have yet:

```
A -> voice_invite  { boxPub: A_pub }             "want to talk?"
B -> voice_offer   { boxPub: B_pub, sealed(A) }   B accepts and offers
A -> voice_answer  { sealed(B) }                  A answers
```

The **inviter becomes the WebRTC answerer**, so a declined invite costs no ICE
traffic. ICE is non-trickle (gather fully, then publish) — statement allowance
is the scarce resource, not latency. Simultaneous invites are resolved by lower
SS58 wins.

- **SDP sealing is mandatory, not a nicety** (`lib/voice/sdpSeal.ts`). A
  non-trickle SDP contains the player's public IP and the Statement Store is a
  public bulletin board. X25519 → HKDF-SHA256 → AES-256-GCM, ephemeral key per
  message. A sealed SDP that will not open is DROPPED — never retried in clear.
- **Ask the host for `Microphone` before `getUserMedia`** (`lib/webrtc/microphone.ts`).
  The Desktop webview maps every `getUserMedia` to one `Camera` permission, so
  the mic never gets its OS prompt and capture fails even after the user
  approves the host dialog. This is the most likely cause of "voice does nothing
  on desktop".
- Mute disables the track rather than stopping it: stopping releases the device
  and needs a fresh permission round-trip to undo.
- Scope is deliberately 1-to-1. Emoji Pictionary (3–8 players) is excluded —
  `VoiceContext` returns `available: false` for it and for `vs Computer`.
- See `docs/p2p-voice-video.md` for the mesh/video analysis this was cut down from.

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
const {
  mode,               // 'detecting' | 'host' | 'standalone'
  isConnected, address, h160Address, displayName, balance,
  hostSigningReady,   // host handed over a product account → host statements can sign
  connect, disconnect, selectAccount,
  getSigner,          // host: host-routed PolkadotSigner; standalone: pjs signer
  getSignRaw,         // standalone only — null in host mode
  getPublicKey,
} = usePolkadotWallet();
```

In host mode the app gets ONE deterministic **product account** per
`(PRODUCT_IDENTIFIER, 0)`, distinct from the user's main wallet, so
`selectAccount` is a no-op there. `PRODUCT_IDENTIFIER` is derived from
`window.location` — if the host refuses with `DomainNotValid`, check the
identifier and `DOTNS_SUFFIX` logged at startup before anything else.

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

See `.env.example`. The app works without a `.env` file. Two matter for the host
containers: `VITE_CHAIN_GENESIS` (the chain the host is asked to serve) and
`VITE_DOTNS_SUFFIX` (the TLD products are bound under — `dot` on dot.li, `paseo`
on paseo-next-v2). The `VITE_RPC_*` endpoints are the **standalone path only**;
inside a host the app names its chain by genesis and the host owns the socket.

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

- **Never open a `wss://` socket from host-mode code.** Polkadot Desktop serves
  the page from `polkadot://<name>.<tld>`, where the browser rejects the socket
  outright. Chain access goes through `getHostProvider(genesis)`.
- `vite.config.ts` pins `base: './'` and `assetsInlineLimit: 0` — absolute asset
  paths resolve against the shell's root, not the product's, and the host CSP
  refuses inlined `data:` assets.
- A chain the host cannot serve degrades to "no balance", never "no game" —
  gate every chain read on `isPAPIClientReady()`.
- Lucide icons: Use `aria-label`, NOT `title`
- Modals: Must use `fixed inset-0` positioning
- No emojis in UI
- Wallet required before making moves (game creation/join works without wallet)
- `npm install` without `--include=dev` will skip TypeScript types in this environment
