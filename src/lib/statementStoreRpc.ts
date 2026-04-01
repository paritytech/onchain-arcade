// WebSocket JSON-RPC client for the Substrate Statement Store.
// Connects to the statement store node, submits SCALE-encoded statements,
// and subscribes for real-time push updates.

import { blake2AsHex } from '@polkadot/util-crypto'
import { toBytes } from 'viem'
import {
  encodeSignatureMaterial,
  encodeStatement,
  decodeStatementFields,
  toHex,
  fromHex,
  PROOF_TAG,
  type StatementFields,
} from './scale'
import { signStatement } from './statementSigner'
import type { GameStatement } from '@/types/game'

const STATEMENT_STORE_URL =
  import.meta.env.VITE_STATEMENT_STORE_URL || 'wss://pop3-testnet.parity-lab.parity.io/people'

const RECONNECT_MS = 3000
const MAX_RECONNECT_ATTEMPTS = 15
// Expiry format: (unix_timestamp_seconds << 32) | sequence_counter
// Matches the productivity project's convention. 30-second TTL keeps
// the game account's storage clean after each game.
const EXPIRY_TTL_SECONDS = 30n
let statementSequence = 0

// App-level topic: blake2b-256("ttt-game") — used for server-side filtering
const APP_TOPIC = fromHex(blake2AsHex(toBytes('ttt-game')))
const APP_TOPIC_HEX = toHex(APP_TOPIC)

/** Derive a 32-byte topic from a game ID. */
export function gameIdToTopic(gameId: string): Uint8Array {
  return fromHex(blake2AsHex(toBytes(`ttt:${gameId.toUpperCase()}`)))
}

/** Encode a GameStatement as bytes for the Statement Store data field. */
function encodeGameStatement(stmt: GameStatement): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(stmt))
}

/** Decode a GameStatement from Statement Store data field bytes. */
function decodeGameStatement(data: Uint8Array): GameStatement | null {
  try {
    return JSON.parse(new TextDecoder().decode(data)) as GameStatement
  } catch {
    return null
  }
}

type StatementCallback = (stmt: GameStatement, signer: Uint8Array | null) => void
type PendingRequest = {
  resolve: (result: unknown) => void
  reject: (err: Error) => void
}

class StatementStoreRpc {
  private ws: WebSocket | null = null
  private _connected = false
  private _enabled = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectAttempts = 0
  private rpcId = 0
  private pendingRequests = new Map<number, PendingRequest>()
  private subscriptionId: string | null = null
  private onStatement: StatementCallback | null = null
  private _readyResolve: (() => void) | null = null
  private _readyPromise: Promise<void> | null = null

  /** Start the connection and set the callback for incoming statements. */
  connect(onStatement: StatementCallback) {
    this.onStatement = onStatement
    this._enabled = true
    this.reconnectAttempts = 0
    this._doConnect()
  }

  private _waitForConnection(): Promise<void> {
    if (this._connected) return Promise.resolve()
    if (!this._readyPromise) {
      this._readyPromise = new Promise((resolve) => {
        this._readyResolve = resolve
      })
    }
    return this._readyPromise
  }

  private _doConnect() {
    if (!this._enabled) return
    this._readyPromise = new Promise((resolve) => {
      this._readyResolve = resolve
    })
    try {
      this.ws = new WebSocket(STATEMENT_STORE_URL)

      this.ws.onopen = () => {
        this._connected = true
        this.reconnectAttempts = 0
        console.log('[SS] ✓ Connected to', STATEMENT_STORE_URL)
        this._readyResolve?.()
        this._sendSubscribe()
      }

      this.ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data as string)
          this._handleMessage(msg)
        } catch {
          // ignore parse errors
        }
      }

      this.ws.onclose = (e) => {
        console.warn('[SS] ✗ WebSocket closed:', e.code, e.reason || '(no reason)')
        this._connected = false
        this.subscriptionId = null
        this._rejectAllPending('WebSocket closed')
        this._reconnect()
      }

      this.ws.onerror = () => {
        // onclose fires after onerror
      }
    } catch {
      this._reconnect()
    }
  }

  private _handleMessage(msg: Record<string, unknown>) {
    // RPC response
    if (typeof msg.id === 'number' && this.pendingRequests.has(msg.id)) {
      const pending = this.pendingRequests.get(msg.id)!
      this.pendingRequests.delete(msg.id)
      if (msg.error) {
        pending.reject(new Error(JSON.stringify(msg.error)))
      } else {
        pending.resolve(msg.result)
      }
      return
    }

    // Subscription notification
    if (msg.method === 'statement_statement' && msg.params) {
      const params = msg.params as { subscription: string; result: unknown }
      if (!this.subscriptionId && params.subscription) {
        this.subscriptionId = params.subscription
        console.log('[SS] ✓ Subscription active, id:', this.subscriptionId)
      }
      this._handleSubscriptionEvent(params.result)
    }
  }

  private _handleSubscriptionEvent(event: unknown) {
    if (!event || typeof event !== 'object') return
    const evt = event as Record<string, unknown>

    // Extract statements array from all known JSON shapes
    let statements: string[] | undefined
    const newStmts = (evt as any).newStatements
    if (newStmts && Array.isArray(newStmts.statements)) {
      statements = newStmts.statements
    }
    if (!statements && Array.isArray(evt.statements)) {
      statements = evt.statements as string[]
    }
    if (!statements && (evt as any).data?.statements) {
      statements = (evt as any).data.statements
    }

    if (!Array.isArray(statements) || statements.length === 0) return

    const remaining = (evt as any).data?.remaining ?? (evt as any).newStatements?.remaining ?? null
    console.log(`[SS] ← Received batch: ${statements.length} statement(s)${remaining != null ? `, ${remaining} remaining` : ''}`)

    let matched = 0
    let skippedTopic = 0
    let skippedNoData = 0
    let decodeFailed = 0

    for (const encodedHex of statements) {
      try {
        const encoded = fromHex(encodedHex)
        const { topics, data, signer } = decodeStatementFields(encoded)

        // Filter: only our app's statements (topic1 = APP_TOPIC)
        if (topics.length < 1 || !arraysEqual(topics[0], APP_TOPIC)) {
          skippedTopic++
          continue
        }

        if (!data) {
          skippedNoData++
          continue
        }

        const gameStmt = decodeGameStatement(data)
        if (gameStmt && this.onStatement) {
          console.log(`[SS] ← Game statement: ${gameStmt.type} gameId=${gameStmt.gameId}`)
          this.onStatement(gameStmt, signer)
          matched++
        }
      } catch {
        decodeFailed++
      }
    }

    console.log(`[SS] ← Batch result: ${matched} matched, ${skippedTopic} wrong topic, ${skippedNoData} no data, ${decodeFailed} decode errors`)
  }

  private _reconnect() {
    if (this.reconnectTimer || !this._enabled) return
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return
    this.reconnectAttempts++
    console.log(`[SS] Reconnecting (attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this._doConnect()
    }, RECONNECT_MS)
  }

  private _rejectAllPending(reason: string) {
    for (const [, pending] of this.pendingRequests) {
      pending.reject(new Error(reason))
    }
    this.pendingRequests.clear()
  }

  private async _rpcCall(method: string, params: unknown[]): Promise<unknown> {
    await this._waitForConnection()

    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected to Statement Store'))
        return
      }

      const id = ++this.rpcId
      this.pendingRequests.set(id, { resolve, reject })

      this.ws.send(JSON.stringify({ jsonrpc: '2.0', id, method, params }))

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id)
          reject(new Error(`RPC timeout: ${method}`))
        }
      }, 15000)
    })
  }

  /**
   * Subscribe with TopicFilter::MatchAll([APP_TOPIC]) so the node only sends
   * statements tagged with our app topic. This avoids downloading 3500+ unrelated
   * statements on connect.
   */
  private _sendSubscribe() {
    if (!this._connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return

    // Unsubscribe from stale subscription
    if (this.subscriptionId) {
      this.ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id: ++this.rpcId,
        method: 'statement_unsubscribeStatement',
        params: [this.subscriptionId],
      }))
      this.subscriptionId = null
    }

    const id = ++this.rpcId
    this.pendingRequests.set(id, {
      resolve: (result) => {
        this.subscriptionId = result as string
        console.log('[SS] ✓ Subscribed, id:', this.subscriptionId)
      },
      reject: (err) => {
        console.warn('[SS] ✗ Subscribe failed:', err, '— falling back to TopicFilter::Any')
        this._sendSubscribeFallback()
      },
    })

    // Try MatchAll filter first — only our app's statements
    console.log('[SS] → Subscribing with MatchAll([APP_TOPIC])...')
    this.ws.send(JSON.stringify({
      jsonrpc: '2.0',
      id,
      method: 'statement_subscribeStatement',
      params: [{ matchAll: [APP_TOPIC_HEX] }],
    }))
  }

  /** Fallback: subscribe to everything if MatchAll filter isn't supported. */
  private _sendSubscribeFallback() {
    if (!this._connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return

    const id = ++this.rpcId
    this.pendingRequests.set(id, {
      resolve: (result) => {
        this.subscriptionId = result as string
        console.log('[SS] ✓ Subscribed (Any fallback), id:', this.subscriptionId)
      },
      reject: (err) => {
        console.warn('[SS] ✗ Subscribe fallback also failed:', err)
      },
    })

    console.log('[SS] → Subscribing with TopicFilter::Any (fallback)...')
    this.ws.send(JSON.stringify({
      jsonrpc: '2.0',
      id,
      method: 'statement_subscribeStatement',
      params: ['any'],
    }))
  }

  /**
   * Submit a game statement to the Statement Store.
   * Signs with an ephemeral Ed25519 keypair.
   */
  async submit(gameStmt: GameStatement): Promise<void> {
    console.log(`[SS] → Submitting: ${gameStmt.type} gameId=${gameStmt.gameId}`)

    const gameTopic = gameIdToTopic(gameStmt.gameId)
    const data = encodeGameStatement(gameStmt)

    const fields: StatementFields = {
      expiry: (BigInt(Math.floor(Date.now() / 1000)) + EXPIRY_TTL_SECONDS) << 32n | BigInt(statementSequence++),
      topics: [APP_TOPIC, gameTopic],
      data,
    }

    const sigMaterial = encodeSignatureMaterial(fields)
    const { signature, publicKey } = await signStatement(sigMaterial)

    const encoded = encodeStatement(fields, {
      proofTag: PROOF_TAG.Sr25519,
      signature,
      signer: publicKey,
    })

    console.log(`[SS] → Encoded statement: ${encoded.length} bytes`)

    const result = await this._rpcCall('statement_submit', [toHex(encoded)])
    const r = result as Record<string, unknown>
    const accepted = r?.status === 'new' || r?.status === 'known'

    console.log(`[SS] ${accepted ? '✓' : '✗'} Submit result: ${JSON.stringify(result)}`)

    if (r?.status === 'invalid' || r?.status === 'rejected') {
      throw new Error(`Statement rejected: ${JSON.stringify(result)}`)
    }
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
    this._rejectAllPending('Disconnecting')
    this.ws?.close()
    this.ws = null
    this._connected = false
    this.subscriptionId = null
  }
}

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export const statementStoreRpc = new StatementStoreRpc()
