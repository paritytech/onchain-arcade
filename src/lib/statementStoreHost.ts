// Statement Store transport for the Polkadot host container (Desktop, Mobile,
// and the browser shell), over `@parity/product-sdk/host`.
//
// The host owns the chain connection, the RFC-0010 allowance slot and the
// signing: we hand it an unsigned statement and it returns a proof, which we
// submit back through the same adapter. `createProofAuthorized` means the host
// picks the allowance-bearing account itself — we never name one, which is what
// the old `createProof(accountId, …)` path required and what failed with
// `StatementProofErr::UnableToSign`.
//
// Wire format:
//   - topics are 32-byte Blake2 hashes in app code, hex on the host wire
//   - Statement.data carries the GameStatement as UTF-8 JSON, hex-encoded
//   - subscriptions receive a page of SignedStatements at a time
//
// The hex boundary is this module and nowhere else.
//
// In standalone (plain browser) mode the raw WebSocket RPC transport
// (statementStoreRpc) is used instead — see statementStore.ts for the routing.

import {
  fromHex,
  getStatementStore,
  toHex,
  type HostStatementStore,
  type StatementsPage,
} from '@parity/product-sdk/host'
import { Blake2256 } from '@polkadot-api/substrate-bindings'
import { AccountId } from 'polkadot-api'

import type { GameStatement } from '@/types/game'
import { createExpiryAllocator, priorityRejectionMinimum } from './host/expiry'
import { ensureStatementGrants, GRANT_FAILURE_COPY, type GrantOutcome } from './host/allowance'

// Derived from the store's own signatures rather than imported from
// @parity/truapi, so this module depends only on the SDK entry point it uses.
type Statement = Parameters<HostStatementStore['createProofAuthorized']>[0]
type SignedStatement = Parameters<HostStatementStore['submit']>[0]

// --- Topics ---------------------------------------------------------------
// Blake2-256 over a stable namespace string, matching the rest of the Substrate
// ecosystem (and the SDK's own `stringToTopic`). This replaces the old
// `blake2AsHex` from @polkadot/util-crypto, so the host path no longer drags
// the whole @polkadot/api crypto stack into the bundle.
//
// `@polkadot-api/substrate-bindings` is a DIRECT dependency in package.json,
// not borrowed from polkadot-api's nested copy. npm installs it under
// node_modules/polkadot-api/node_modules/, which this import cannot reach, so
// an undeclared import here resolves only if some unrelated copy happens to sit
// higher up the tree — it typechecks on the author's machine and fails the
// clean CI checkout. Keep it declared.

const utf8 = new TextEncoder()
const utf8d = new TextDecoder()

/** App-level topic: every game statement carries it, and it is what we subscribe to. */
const APP_TOPIC = Blake2256(utf8.encode('ttt-game'))

/** Per-game topic — a second tag so a future per-game subscription is possible. */
function gameTopic(gameId: string): Uint8Array {
  return Blake2256(utf8.encode(`ttt:${gameId.toUpperCase()}`))
}

/**
 * Statement lifetime. Five minutes is long enough for a peer to pick up a move
 * they missed while their tab was backgrounded, without bloating the store or
 * holding an allowance slot longer than needed.
 */
const DEFAULT_EXPIRY_SECS = 60 * 5

const accountIdCodec = AccountId()

/** SS58 address of the statement signer, taken from the chain-side proof —
 *  never from any field inside the JSON payload. Null when the proof uses a
 *  shape this build does not know. */
function ss58FromProof(proof: SignedStatement['proof']): string | null {
  if (!proof) return null
  try {
    switch (proof.tag) {
      case 'Sr25519':
      case 'Ed25519':
      case 'Ecdsa':
        return accountIdCodec.dec(proof.value.signer)
      case 'OnChain':
        return accountIdCodec.dec(proof.value.who)
      default:
        return null
    }
  } catch {
    return null
  }
}

type StatementCallback = (stmt: GameStatement, signerSs58: string | null) => void

class StatementStoreHost {
  private store: HostStatementStore | null = null
  private onStatement: StatementCallback | null = null
  private subscription: { unsubscribe: () => void } | null = null
  private disposed = false
  private _connected = false
  /** Set before the first await in connect(). `_connected` only flips after
   *  `getStatementStore()` resolves, so without this two calls inside that
   *  window would both pass the guard and open two subscriptions. */
  private connecting = false
  /** One allocator for this client's signing account — every submit draws from
   *  it, so same-second statements cannot tie. */
  private readonly expiry = createExpiryAllocator()
  /** Last grant outcome surfaced, so one condition reports once. */
  private reportedGrantOutcome: GrantOutcome | null = null

  /** Signing/publishing cannot work and will not recover without a reload. */
  onFatalError?: (error: Error) => void

  /**
   * Attach to the host statement store and subscribe to the app topic.
   *
   * `getStatementStore()` is ASYNC and resolves null outside a host container,
   * so both failure modes are reported rather than left silent: the caller is
   * an effect, and a store that never arrives would otherwise look identical to
   * a quiet game.
   */
  async connect(onStatement: StatementCallback): Promise<void> {
    if (this._connected || this.connecting) return
    this.connecting = true
    // Reset the dispose latch: disconnect() sets it to stop in-flight callbacks
    // from the previous session, and leaving it set would make the singleton
    // permanently dead — a disconnect/reconnect cycle (host sign-out then
    // sign-in) would silently never resubscribe.
    this.disposed = false
    this.onStatement = onStatement

    let store: HostStatementStore | null
    try {
      store = await getStatementStore()
    } catch (err) {
      this.connecting = false
      const detail = err instanceof Error ? err.message : String(err)
      console.error('[SS:Host] Statement store unavailable:', detail)
      this.onFatalError?.(new Error(`Statement Store unavailable: ${detail}. Reload to try again.`))
      return
    }
    this.connecting = false
    if (this.disposed) return
    if (!store) {
      console.warn('[SS:Host] No host statement store — not inside a host container')
      this.onFatalError?.(
        new Error(
          'No Statement Store on this host. Multiplayer needs Polkadot Desktop, ' +
            'Polkadot Mobile, or the browser host.',
        ),
      )
      return
    }

    this.store = store
    this._connected = true
    this.openSubscription()
    // Start the grant bootstrap now, so the round-trip is long done by the time
    // the player makes their first move.
    this.primeGrants()
    console.log('[SS:Host] Connected, subscription active')
  }

  /** Open the upstream subscription, re-opening it whenever the host
   *  interrupts it (tab visibility transitions, bridge reconnects). Without
   *  this the app goes deaf for the rest of the page's lifetime. */
  private openSubscription(): void {
    if (!this.store || this.disposed) return

    const sub = this.store.subscribe({ matchAll: [toHex(APP_TOPIC)] }, (page: StatementsPage) => {
      let decoded = 0
      for (const stmt of page.statements) {
        const parsed = decodeSignedStatement(stmt)
        if (!parsed) continue
        decoded++
        try {
          this.onStatement?.(parsed.gameStmt, parsed.signedBy)
        } catch (err) {
          console.error('[SS:Host] Statement handler threw:', err)
        }
      }
      // One line per page, never per statement: a busy topic would otherwise
      // bury everything else in the console.
      if (page.statements.length > 0) {
        console.log(`[SS:Host] ← page: ${decoded}/${page.statements.length} decoded`)
      }
    })

    sub.onInterrupt((reason) => {
      if (this.disposed) return
      console.warn('[SS:Host] Subscription interrupted — resubscribing', reason)
      this.openSubscription()
    })

    this.subscription = { unsubscribe: () => sub.unsubscribe() }
  }

  /** Ensure the grants are being established without blocking the caller.
   *  Idempotent and memoized per day-slot, so calling it on every submit costs
   *  nothing after the first. */
  private primeGrants(): void {
    void ensureStatementGrants().then((outcome) => {
      if (outcome === 'granted' || this.disposed) return
      if (this.reportedGrantOutcome === outcome) return
      this.reportedGrantOutcome = outcome
      console.error('[SS:Host] Statement grants not available:', outcome)
      this.onFatalError?.(new Error(GRANT_FAILURE_COPY[outcome]))
    })
  }

  /**
   * Sign and publish a game statement.
   *
   * One retry on a priority rejection: adopt the chain-reported minimum and
   * re-mint above it. The proof covers the expiry, so a re-mint means a fresh
   * createProofAuthorized too. Beyond one retry we surface honestly rather than
   * loop — the caller re-submits on the next move anyway.
   */
  async submit(gameStmt: GameStatement): Promise<void> {
    if (this.disposed) throw new Error('[SS:Host] Disposed')
    if (!this.store) throw new Error('[SS:Host] Not connected — call connect() first')

    // Kick the grant bootstrap, but never wait for it. requestResourceAllocation
    // can hang until its deadline, and awaiting here would stall the move for
    // that whole window. A missing grant surfaces as the createProof error below.
    this.primeGrants()

    const data = toHex(utf8.encode(JSON.stringify(gameStmt)))
    const topics = [toHex(APP_TOPIC), toHex(gameTopic(gameStmt.gameId))]

    for (let attempt = 0; ; attempt++) {
      const unsigned: Statement = {
        proof: undefined,
        decryptionKey: undefined,
        expiry: this.expiry.next(DEFAULT_EXPIRY_SECS),
        channel: undefined,
        topics,
        data,
      }

      let proof
      try {
        proof = await this.store.createProofAuthorized(unsigned)
      } catch (err) {
        console.error('[SS:Host] ✗ createProofAuthorized failed:', err)
        throw err instanceof Error ? err : new Error(String(err))
      }

      try {
        await this.store.submit({ ...unsigned, proof } satisfies SignedStatement)
        console.log(`[SS:Host] ✓ Submitted ${gameStmt.type} for ${gameStmt.gameId}`)
        return
      } catch (err) {
        const min = attempt === 0 ? priorityRejectionMinimum(err) : null
        // raiseFloor refuses an implausible minimum (it is scraped from an
        // untyped error). Retrying on a floor it declined would re-mint the
        // same value and fail identically, so only retry when it was adopted.
        if (min !== null && this.expiry.raiseFloor(min)) {
          console.warn('[SS:Host] Rejected below the priority floor — re-minting above it', String(min))
          continue
        }
        console.error('[SS:Host] ✗ Submit failed:', err)
        throw err instanceof Error ? err : new Error(String(err))
      }
    }
  }

  get connected() {
    return this._connected
  }

  disconnect() {
    this.disposed = true
    try {
      this.subscription?.unsubscribe()
    } catch {
      /* best-effort */
    }
    this.subscription = null
    this.store = null
    this.onStatement = null
    this._connected = false
    this.connecting = false
    console.log('[SS:Host] Disconnected')
  }
}

function decodeSignedStatement(
  stmt: SignedStatement,
): { gameStmt: GameStatement; signedBy: string | null } | null {
  if (!stmt.data || stmt.data.length <= 2) return null
  try {
    const gameStmt = JSON.parse(utf8d.decode(fromHex(stmt.data))) as GameStatement
    if (!gameStmt || typeof gameStmt.type !== 'string' || typeof gameStmt.gameId !== 'string') {
      return null
    }
    return { gameStmt, signedBy: ss58FromProof(stmt.proof) }
  } catch {
    return null
  }
}

export const statementStoreHost = new StatementStoreHost()
