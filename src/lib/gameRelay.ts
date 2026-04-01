// Client-side WebSocket connection to the game relay server.
// Sends and receives individual game statements for real-time sync.
// Falls back gracefully when the relay is unavailable.

import type { GameStatement } from '@/types/game'

type StatementHandler = (stmt: GameStatement) => void
type StatementsRequestHandler = (gameId: string) => void

const RELAY_URL = import.meta.env.VITE_RELAY_URL || 'ws://localhost:4001'
const RECONNECT_MS = 3000
const MAX_RECONNECT_ATTEMPTS = 10

class GameRelay {
  private ws: WebSocket | null = null
  private onStatement: StatementHandler | null = null
  private onStatementsRequest: StatementsRequestHandler | null = null
  private rooms = new Set<string>()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectAttempts = 0
  private _connected = false
  private _enabled = true

  /** Start the relay connection. Callbacks fire on incoming messages. */
  connect(onStatement: StatementHandler, onStatementsRequest: StatementsRequestHandler) {
    this.onStatement = onStatement
    this.onStatementsRequest = onStatementsRequest
    this._enabled = true
    this.reconnectAttempts = 0
    this._doConnect()
  }

  private _doConnect() {
    if (!this._enabled) return
    try {
      this.ws = new WebSocket(RELAY_URL)

      this.ws.onopen = () => {
        this._connected = true
        this.reconnectAttempts = 0
        // Re-subscribe to all rooms after reconnect
        for (const gameId of this.rooms) {
          this._send({ type: 'subscribe', gameId })
        }
      }

      this.ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg.type === 'statement' && msg.statement && this.onStatement) {
            this.onStatement(msg.statement as GameStatement)
          } else if (msg.type === 'statements_batch' && Array.isArray(msg.statements) && this.onStatement) {
            for (const stmt of msg.statements) {
              this.onStatement(stmt as GameStatement)
            }
          } else if (msg.type === 'request_statements' && this.onStatementsRequest) {
            this.onStatementsRequest(msg.gameId)
          }
        } catch {
          // ignore parse errors
        }
      }

      this.ws.onclose = () => {
        this._connected = false
        this._reconnect()
      }

      this.ws.onerror = () => {
        // onclose fires after onerror, reconnect handled there
      }
    } catch {
      this._reconnect()
    }
  }

  private _reconnect() {
    if (this.reconnectTimer || !this._enabled) return
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return
    this.reconnectAttempts++
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this._doConnect()
    }, RECONNECT_MS)
  }

  private _send(data: unknown) {
    if (this._connected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  /** Subscribe to updates for a game room. */
  subscribe(gameId: string) {
    this.rooms.add(gameId)
    this._send({ type: 'subscribe', gameId })
  }

  /** Broadcast a single statement to other clients in the game room. */
  sendStatement(stmt: GameStatement) {
    this.subscribe(stmt.gameId)
    this._send({ type: 'statement', gameId: stmt.gameId, statement: stmt })
  }

  /** Send a batch of statements (used for sync when a new player joins). */
  sendStatementsBatch(gameId: string, statements: GameStatement[]) {
    this.subscribe(gameId)
    this._send({ type: 'statements_batch', gameId, statements })
  }

  /** Ask other clients for all statements of a game (for bootstrapping). */
  requestStatements(gameId: string) {
    this.subscribe(gameId)
    this._send({ type: 'request_statements', gameId })
  }

  get connected() {
    return this._connected
  }

  disconnect() {
    this._enabled = false
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
    this.ws = null
    this._connected = false
  }
}

export const gameRelay = new GameRelay()
