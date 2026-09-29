// Statement Store: event-sourced game state backed by the Substrate Statement Store RPC.
// Statements are submitted to the on-chain statement store for propagation and
// received in real-time via subscription. localStorage serves as a local cache.

import type { GameStatement } from '@/types/game'
import { statementStoreRpc } from './statementStoreRpc'
import { statementStoreHost } from './statementStoreHost'
import { deriveGame } from './games'

export type { DerivedGame, DerivedTicTacToe, DerivedConnectFour, DerivedNim } from '@/types/derived-game'
import type { DerivedGame } from '@/types/derived-game'

type Listener = () => void

/** Mirrors WalletContext's WalletMode — the environment the transport is
 *  picked from. Declared here rather than imported so this module stays free
 *  of a React-context dependency. */
export type StatementTransportMode = 'detecting' | 'host' | 'standalone'

const STORAGE_KEY = 'ttt_statements'

function loadStatements(): GameStatement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as GameStatement[]) : []
  } catch {
    return []
  }
}

function saveStatements(stmts: GameStatement[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stmts))
  } catch {
    // storage full
  }
}

class StatementStore {
  private statements: GameStatement[] = []
  private listeners = new Set<Listener>()
  private gameCache = new Map<string, DerivedGame>()
  private allGameIds = new Set<string>()
  private channel: BroadcastChannel | null = null
  private _rpcConnected = false
  private _useHostTransport = false
  // Cached snapshot for useSyncExternalStore — must return the same reference
  // unless the underlying data actually changed.
  private _allGamesSnapshot: DerivedGame[] = []
  private _snapshotDirty = true
  private _dirtyGameIds = new Set<string>()

  /**
   * A statement was applied locally but never published. Local state is intact,
   * so the player's own board stays right — but the opponent will never see the
   * move, and without a surface that is indistinguishable from a quiet game.
   * Wired in GameProvider.
   */
  onSubmitError?: (error: Error, stmt: GameStatement) => void

  constructor() {
    this.statements = loadStatements()
    this.rebuildIndex()
    this._rebuildSnapshot()
    this.initBroadcastChannel()
  }

  private initBroadcastChannel() {
    this.channel = new BroadcastChannel('ttt_statement_sync')
    this.channel.onmessage = (e) => {
      if (e.data?.type === 'statements_updated') {
        this.statements = loadStatements()
        this.invalidateAll()
        this.notify()
      }
    }

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.statements = loadStatements()
        this.invalidateAll()
        this.notify()
      }
    })
  }

  /**
   * Connect the statement transport for real-time updates.
   *
   * @param mode — the wallet's resolved environment. Taken from the caller
   *   rather than re-derived here: WalletContext settles it with the SDK's
   *   async `isInsideContainer()` handshake, and a second, synchronous guess in
   *   this file could disagree with it. A framed page with no working bridge is
   *   exactly where the two diverge, and the disagreement is unrecoverable —
   *   the wallet would run standalone (so `hostSigningReady` stays false) while
   *   this file waited for a host account that is never coming, leaving the
   *   player with no multiplayer at all and nothing in the log to say why.
   * @param hostSigningReady — true once the host has handed over a product
   *   account, i.e. the host transport can actually sign.
   *
   * Inside a Polkadot host container (Desktop, Mobile, browser shell) the host
   * transport is used: the host owns the chain connection, the RFC-0010
   * allowance and the signing. The raw WebSocket RPC transport is for
   * standalone browser mode only, where the app signs with its own key — a
   * `wss://` socket opened from inside the desktop host is blocked by its
   * `polkadot://` page scheme, so it must never be the host-mode path.
   *
   * A host-mode connection is deferred until the product account arrives, and
   * upgraded from raw RPC if one was already open.
   */
  connectRpc(mode: StatementTransportMode, hostSigningReady = false) {
    if (mode === 'detecting') return

    const inHost = mode === 'host'

    // Upgrade: already on raw RPC, but now inside a host with a signing account.
    if (this._rpcConnected && !this._useHostTransport && inHost && hostSigningReady) {
      console.log('[GameStore] Upgrading from raw RPC to the host transport...')
      statementStoreRpc.disconnect()
      this._rpcConnected = false
    }

    if (this._rpcConnected) return

    // `_signer` is the chain-verified statement signer and is deliberately
    // unused — move authorship is trusted from the JSON payload. See the note
    // on ss58FromProof in statementStoreHost.ts for why enforcing it needs a
    // real-host experiment first rather than a one-line guess.
    const onStatement = (gameStmt: GameStatement, _signer: Uint8Array | string | null) => {
      const ingested = this.ingestRemote(gameStmt)
      if (ingested) {
        const game = this.getGame(gameStmt.gameId)
        console.log(`[GameStore] \u2713 Ingested remote ${gameStmt.type} for game ${gameStmt.gameId} \u2192 status=${game?.status}, players=${game?.playerX?.slice(0,8)}.../${game?.playerO?.slice(0,8) ?? 'none'}...`)
      } else {
        console.log(`[GameStore] \u25cb Duplicate ${gameStmt.type} for game ${gameStmt.gameId}, skipped`)
      }
    }

    if (inHost) {
      // Set BEFORE the defer check, not after. applyAndSubmit picks its
      // transport from this flag, and leaving it false while deferred routed
      // host-mode submits into statementStoreRpc — which was never connected,
      // so `_waitForConnection()` awaited a promise only `_doConnect()` ever
      // resolves and `makeMove` hung forever with no error and no timeout.
      // Reachable whenever `address` outlives `hostSigningReady`, which is
      // exactly what a bridge interrupt produces.
      this._useHostTransport = true
      if (!hostSigningReady) {
        // No product account yet — GameContext re-runs this once the host
        // hands one over. Connecting now would attach a store that cannot sign.
        console.log('[GameStore] In a host container but no product account yet — deferring connection')
        return
      }
      console.log('[GameStore] Connecting via the host transport...')
      this._rpcConnected = true
      void statementStoreHost.connect(onStatement)
    } else {
      console.log('[GameStore] Connecting via raw WebSocket RPC transport (standalone)...')
      this._rpcConnected = true
      this._useHostTransport = false
      statementStoreRpc.connect(onStatement)
    }
  }

  private rebuildIndex() {
    this.allGameIds.clear()
    this.gameCache.clear()
    for (const s of this.statements) {
      this.allGameIds.add(s.gameId)
    }
  }

  private invalidateAll() {
    this.gameCache.clear()
    this.allGameIds.clear()
    for (const s of this.statements) {
      this.allGameIds.add(s.gameId)
    }
    this._dirtyGameIds.clear() // full rebuild, no targeted update
    this._snapshotDirty = true
  }

  private invalidateGame(gameId: string) {
    this.gameCache.delete(gameId)
    this._dirtyGameIds.add(gameId)
    this._snapshotDirty = true
  }

  private _persistTimer: ReturnType<typeof setTimeout> | null = null

  /** Persist immediately (for local actions). */
  private persist() {
    if (this._persistTimer) {
      clearTimeout(this._persistTimer)
      this._persistTimer = null
    }
    saveStatements(this.statements)
    this.channel?.postMessage({ type: 'statements_updated' })
  }

  /** Debounced persist — batches writes within 100ms (for remote ingestion bursts). */
  private persistDebounced() {
    if (this._persistTimer) return // already scheduled
    this._persistTimer = setTimeout(() => {
      this._persistTimer = null
      saveStatements(this.statements)
      this.channel?.postMessage({ type: 'statements_updated' })
    }, 100)
  }

  private _rebuildSnapshot() {
    if (this._dirtyGameIds.size > 0 && this._allGamesSnapshot.length > 0) {
      // Targeted update: only re-derive dirty games
      let snapshot = [...this._allGamesSnapshot]
      for (const dirtyId of this._dirtyGameIds) {
        const updated = this.getGame(dirtyId)
        const idx = snapshot.findIndex(g => g.id === dirtyId)
        if (updated && idx >= 0) {
          snapshot[idx] = updated
        } else if (updated) {
          snapshot.push(updated)
        } else if (idx >= 0) {
          snapshot.splice(idx, 1)
        }
      }
      this._allGamesSnapshot = snapshot.sort((a, b) => b.updatedAt - a.updatedAt)
    } else {
      // Full rebuild (first load or invalidateAll)
      const games: DerivedGame[] = []
      for (const id of this.allGameIds) {
        const g = this.getGame(id)
        if (g) games.push(g)
      }
      this._allGamesSnapshot = games.sort((a, b) => b.updatedAt - a.updatedAt)
    }
    this._dirtyGameIds.clear()
    this._snapshotDirty = false
  }

  private notify() {
    if (this._snapshotDirty) {
      this._rebuildSnapshot()
    }
    for (const fn of this.listeners) fn()
  }

  /** Check if a statement is a duplicate. */
  private isDuplicate(stmt: GameStatement): boolean {
    return this.statements.some(s => {
      if (s.type !== stmt.type || s.gameId !== stmt.gameId || s.timestamp !== stmt.timestamp) return false
      if (s.type === 'create_game' && stmt.type === 'create_game') return s.playerX === stmt.playerX
      if (s.type === 'join_game' && stmt.type === 'join_game') return s.playerO === stmt.playerO
      if (s.type === 'make_move' && stmt.type === 'make_move') {
        if (s.player !== stmt.player) return false
        if (s.cellIndex != null && stmt.cellIndex != null) return s.cellIndex === stmt.cellIndex
        if (s.column != null && stmt.column != null) return s.column === stmt.column
        if (s.nimMove && stmt.nimMove) return s.nimMove.heap === stmt.nimMove.heap && s.nimMove.count === stmt.nimMove.count
        if (s.edge != null && stmt.edge != null) return s.edge === stmt.edge
        if (s.pit != null && stmt.pit != null) return s.pit === stmt.pit
        if (s.ghostLetter && stmt.ghostLetter) return s.ghostLetter === stmt.ghostLetter
        if (s.ghostChallenge && stmt.ghostChallenge) return true
        if (s.hackenbushEdge != null && stmt.hackenbushEdge != null) return s.hackenbushEdge === stmt.hackenbushEdge
        if (s.entropyPlace != null && stmt.entropyPlace != null) return s.entropyPlace === stmt.entropyPlace
        if (s.entropySlide && stmt.entropySlide) return s.entropySlide.from === stmt.entropySlide.from && s.entropySlide.to === stmt.entropySlide.to
        if (s.entropyPass && stmt.entropyPass) return true
        if (s.blokusMove && stmt.blokusMove) return s.blokusMove.pieceId === stmt.blokusMove.pieceId && s.blokusMove.position === stmt.blokusMove.position
        if (s.blokusPass && stmt.blokusPass) return true
        if (s.takPlace && stmt.takPlace) return s.takPlace.position === stmt.takPlace.position
        if (s.takMove && stmt.takMove) return s.takMove.from === stmt.takMove.from && s.takMove.direction === stmt.takMove.direction
        if (s.emojiClue && stmt.emojiClue) return s.emojiClue === stmt.emojiClue
        if (s.guess && stmt.guess) return s.guess === stmt.guess
        if (s.skipRound && stmt.skipRound) return true
        return false
      }
      return false
    })
  }

  /** Add a statement if it's not a duplicate. Returns true if added. */
  private _addIfNew(stmt: GameStatement): boolean {
    if (this.isDuplicate(stmt)) return false
    this.statements.push(stmt)
    this.allGameIds.add(stmt.gameId)
    this.invalidateGame(stmt.gameId)
    return true
  }

  /**
   * Apply a local statement and submit to Statement Store.
   * Applies locally first (optimistic). Network submit is async.
   */
  async applyAndSubmit(stmt: GameStatement): Promise<DerivedGame | null> {
    this._addIfNew(stmt)
    this.persist()
    this.notify()
    console.log(`[GameStore] Applied local: ${stmt.type} gameId=${stmt.gameId}`)

    try {
      if (this._useHostTransport) {
        await statementStoreHost.submit(stmt)
      } else {
        await statementStoreRpc.submit(stmt)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.warn(`[GameStore] ✗ Submit failed for ${stmt.type} (local state preserved):`, error)
      this.onSubmitError?.(error, stmt)
    }

    return this.getGame(stmt.gameId)
  }

  /**
   * Apply a local statement without submitting to RPC.
   * Used for bootstrapping (e.g., creating a game record for the host when joining cross-browser).
   */
  applyLocal(stmt: GameStatement): DerivedGame | null {
    this._addIfNew(stmt)
    this.persist()
    this.notify()
    return this.getGame(stmt.gameId)
  }

  /** Ingest a remote statement (from the RPC subscription). Deduplicates.
   *  Uses debounced persistence to batch writes during subscription dumps. */
  ingestRemote(stmt: GameStatement): boolean {
    if (!this._addIfNew(stmt)) return false
    this.persistDebounced()
    this.notify()
    return true
  }

  /** Get derived game state (cached). */
  getGame(gameId: string): DerivedGame | null {
    const normalized = gameId.toUpperCase()
    if (this.gameCache.has(normalized)) return this.gameCache.get(normalized)!
    const game = deriveGame(normalized, this.statements)
    if (game) this.gameCache.set(normalized, game)
    return game
  }

  /** Get all derived games. Returns a stable reference for useSyncExternalStore. */
  getAllGames(): DerivedGame[] {
    if (this._snapshotDirty) {
      this._rebuildSnapshot()
    }
    return this._allGamesSnapshot
  }

  /** Get all statements for a specific game. */
  getStatementsForGame(gameId: string): GameStatement[] {
    const normalized = gameId.toUpperCase()
    return this.statements.filter(s => s.gameId === normalized)
  }

  /** Check if we have any statements for a game. */
  hasGame(gameId: string): boolean {
    return this.allGameIds.has(gameId.toUpperCase())
  }

  /** Subscribe to state changes. Returns unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  get rpcConnected() {
    return this._useHostTransport ? statementStoreHost.connected : statementStoreRpc.connected
  }

  /** Disconnect RPC but keep the singleton alive (BroadcastChannel stays open). */
  disconnectRpc() {
    this._rpcConnected = false
    if (this._useHostTransport) {
      statementStoreHost.disconnect()
    } else {
      statementStoreRpc.disconnect()
    }
    this._useHostTransport = false
  }
}

export const statementStore = new StatementStore()
