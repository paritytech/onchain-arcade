// Statement Store transport using @novasamatech/product-sdk.
// When running inside the Triangle host (Polkadot Desktop / dot.li),
// uses createStatementStore() for subscribing, signing (createProof),
// and submitting statements to the Statement Store network.
//
// In standalone mode the raw WebSocket RPC transport (statementStoreRpc)
// is used instead — see statementStore.ts for the routing logic.

import {
  createStatementStore,
  type ProductAccountId,
  type SignedStatement,
  type Statement,
} from '@novasamatech/product-sdk'
import { blake2AsHex } from '@polkadot/util-crypto'
import { toBytes } from 'viem'

import type { GameStatement } from '@/types/game'

// --- Topic helpers (blake2b-256 hash → 32-byte Uint8Array) ---

function hashToBytes(input: string): Uint8Array {
  const hex = blake2AsHex(toBytes(input))
  const bytes = new Uint8Array(32)
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hex.slice(2 + i * 2, 4 + i * 2), 16)
  }
  return bytes
}

/** App-level topic: blake2b-256("ttt-game") */
function appTopic(): Uint8Array {
  return hashToBytes('ttt-game')
}

/** Per-game topic: blake2b-256("ttt:{GAMEID}") */
function gameTopic(gameId: string): Uint8Array {
  return hashToBytes(`ttt:${gameId.toUpperCase()}`)
}

const APP_TOPIC = appTopic()
const EXPIRY_TTL_SECONDS = 30n
let statementSequence = 0

type StatementCallback = (stmt: GameStatement, signer: Uint8Array | null) => void

/** Extract signer public key from a SignedStatement proof. */
function extractSigner(proof: SignedStatement['proof']): Uint8Array | null {
  if (!proof || typeof proof !== 'object') return null
  if ('tag' in proof && 'value' in proof) {
    const p = proof as { tag: string; value: { signer?: Uint8Array; who?: Uint8Array } }
    if (p.tag === 'Sr25519' || p.tag === 'Ed25519' || p.tag === 'Ecdsa') {
      return p.value.signer ?? null
    }
    if (p.tag === 'OnChain') {
      return p.value.who ?? null
    }
  }
  return null
}

function topicsEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

class StatementStoreHost {
  private store: ReturnType<typeof createStatementStore> | null = null
  private accountId: ProductAccountId | null = null
  private unsubscribe: (() => void) | null = null
  private onStatement: StatementCallback | null = null
  private _connected = false

  /**
   * Connect to the Statement Store via product-sdk.
   * Creates a statement store instance, subscribes to the app topic,
   * and listens for incoming game statements.
   */
  connect(accountId: ProductAccountId, onStatement: StatementCallback) {
    this.accountId = accountId
    this.onStatement = onStatement
    this._connected = true

    this.store = createStatementStore()
    console.log('[SS:Host] Connecting via product-sdk, accountId:', accountId)

    const subscription = this.store.subscribe([APP_TOPIC], (statements) => {
      console.log(`[SS:Host] ← Received batch: ${statements.length} statement(s)`)

      let matched = 0
      for (const stmt of statements) {
        if (!stmt.topics || stmt.topics.length < 1 || !topicsEqual(stmt.topics[0], APP_TOPIC)) continue
        if (!stmt.data) continue

        try {
          const json = new TextDecoder().decode(stmt.data)
          const gameStmt = JSON.parse(json) as GameStatement
          const signer = stmt.proof ? extractSigner(stmt.proof) : null

          console.log(`[SS:Host] ← Game statement: ${gameStmt.type} gameId=${gameStmt.gameId}`)
          this.onStatement?.(gameStmt, signer)
          matched++
        } catch {
          // skip malformed
        }
      }

      if (statements.length > 0) {
        console.log(`[SS:Host] ← Batch result: ${matched} matched out of ${statements.length}`)
      }
    })

    this.unsubscribe = () => subscription.unsubscribe()
    console.log('[SS:Host] ✓ Subscription active')
  }

  /**
   * Submit a game statement via product-sdk.
   * Signs with createProof() (delegated to the host) then submits.
   */
  async submit(gameStmt: GameStatement): Promise<void> {
    if (!this.accountId || !this.store) {
      throw new Error('[SS:Host] Not connected — call connect() first')
    }

    console.log(`[SS:Host] → Submitting: ${gameStmt.type} gameId=${gameStmt.gameId}`)

    const gameTopicBytes = gameTopic(gameStmt.gameId)
    const data = new TextEncoder().encode(JSON.stringify(gameStmt))

    const statement: Statement = {
      proof: undefined,
      decryptionKey: undefined,
      expiry: BigInt(Math.floor(Date.now() / 1000)) + EXPIRY_TTL_SECONDS << 32n | BigInt(statementSequence++),
      channel: undefined,
      topics: [APP_TOPIC, gameTopicBytes],
      data,
    }

    // Race createProof against a timeout
    const proofPromise = this.store.createProof(this.accountId, statement)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('createProof timeout — host not responding')), 10000)
    })

    let proof: SignedStatement['proof']
    try {
      proof = await Promise.race([proofPromise, timeoutPromise])
      console.log(`[SS:Host] ✓ Proof created (${(proof as any).tag})`)
    } catch (err) {
      console.error('[SS:Host] ✗ createProof failed:', err)
      throw err
    }

    const signedStatement: SignedStatement = {
      ...statement,
      proof,
    }

    try {
      await this.store.submit(signedStatement)
      console.log(`[SS:Host] ✓ Statement submitted: ${gameStmt.type}`)
    } catch (err) {
      console.error('[SS:Host] ✗ Submit failed:', err)
      throw err
    }
  }

  get connected() {
    return this._connected
  }

  disconnect() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
    this.store = null
    this.accountId = null
    this.onStatement = null
    this._connected = false
    console.log('[SS:Host] Disconnected')
  }
}

export const statementStoreHost = new StatementStoreHost()
