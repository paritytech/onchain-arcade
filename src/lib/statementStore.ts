// Statement Store: event-sourced game state backed by the Substrate Statement Store RPC.
// Statements are submitted to the on-chain statement store for propagation and
// received in real-time via subscription. localStorage serves as a local cache.

import type {
  GameStatement,
  GameResult,
  GameStatus,
  PlayerSymbol,
  GameType,
  GridSize,
  CellValue,
} from '@/types/game'
import type { ProductAccountId } from '@novasamatech/product-sdk'
import { statementStoreRpc } from './statementStoreRpc'
import { statementStoreHost } from './statementStoreHost'
import { isInTriangleHost } from './triangle/hostDetection'
import { deriveGame } from './games'

// --- DerivedGame discriminated union ---

interface DerivedGameBase {
  id: string
  gameType: GameType
  playerX: string
  playerXName: string | null
  playerO: string | null
  playerOName: string | null
  currentTurn: PlayerSymbol
  status: GameStatus
  result: GameResult
  moveCount: number
  createdAt: number
  updatedAt: number
}

export interface DerivedTicTacToe extends DerivedGameBase {
  gameType: 'tic-tac-toe'
  gridSize: GridSize
  board: CellValue[]
  winningLine: number[] | null
}

export interface DerivedConnectFour extends DerivedGameBase {
  gameType: 'connect-four'
  board: CellValue[]
  winningLine: number[] | null
}

export interface DerivedNim extends DerivedGameBase {
  gameType: 'nim'
  heaps: number[]
  lastMove: { heap: number; count: number } | null
}

export type DerivedGame = DerivedTicTacToe | DerivedConnectFour | DerivedNim

type Listener = () => void

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
   * Connect to the Statement Store for real-time updates.
   *
   * @param productAccountId — ProductAccountId for host SDK signing. Null for standalone.
   *
   * If productAccountId is provided → uses SDK transport (statementStoreHost).
   * If in host mode but no accountId yet → defers connection.
   * Otherwise (standalone) → uses raw WebSocket RPC (statementStoreRpc).
   *
   * Supports upgrading from raw RPC to SDK when accountId becomes available.
   */
  connectRpc(productAccountId?: ProductAccountId | null) {
    // Upgrade: if already connected via raw RPC but now have an accountId, switch to SDK
    if (this._rpcConnected && !this._useHostTransport && productAccountId) {
      console.log('[GameStore] Upgrading from raw RPC to host SDK transport...')
      statementStoreRpc.disconnect()
      this._rpcConnected = false
    }

    if (this._rpcConnected) return
    this._rpcConnected = true

    const onStatement = (gameStmt: GameStatement, _signer: Uint8Array | null) => {
      const ingested = this.ingestRemote(gameStmt)
      if (ingested) {
        const game = this.getGame(gameStmt.gameId)
        console.log(`[GameStore] ✓ Ingested remote ${gameStmt.type} for game ${gameStmt.gameId} → status=${game?.status}, players=${game?.playerX?.slice(0,8)}.../${game?.playerO?.slice(0,8) ?? 'none'}...`)
      } else {
        console.log(`[GameStore] ○ Duplicate ${gameStmt.type} for game ${gameStmt.gameId}, skipped`)
      }
    }

    if (productAccountId) {
      // Host mode with accountId — use SDK transport
      console.log('[GameStore] Connecting via host SDK transport...')
      this._useHostTransport = true
      statementStoreHost.connect(productAccountId, onStatement)
    } else if (isInTriangleHost()) {
      // In host mode but no accountId yet — defer connection
      console.log('[GameStore] In host mode but no accountId yet — deferring connection')
      this._rpcConnected = false
    } else {
      // Standalone mode — use raw WebSocket RPC
      console.log('[GameStore] Connecting via raw WebSocket RPC transport (standalone)...')
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
      console.warn(`[GameStore] ✗ Submit failed for ${stmt.type} (local state preserved):`, err)
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
