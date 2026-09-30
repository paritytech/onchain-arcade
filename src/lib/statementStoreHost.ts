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
import type { VoiceStatement } from '@/types/voice'
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

/**
 * SS58 address of the statement signer, taken from the chain-side proof rather
 * than from any field inside the JSON payload.
 *
 * NOT CURRENTLY ENFORCED. It is handed to the store's statement handler, which
 * ignores it: move authorship is trusted from the JSON `player` field alone, so
 * any participant who can publish to the app topic can publish a move
 * attributed to their opponent. That is pre-existing behaviour, not something
 * this transport changed, and it is recorded here rather than silently fixed
 * because the obvious fix is wrong in both modes:
 *
 *   - Standalone signs every statement with ONE shared account
 *     (statementSigner.ts), so `player === signedBy` is false for everybody and
 *     enforcing it rejects all traffic.
 *   - In host mode `createProofAuthorized` lets the host pick the
 *     allowance-bearing account. That is expected to be the product account,
 *     i.e. `address` — but "expected" is not "verified", and it cannot be
 *     verified without a real host container.
 *
 * So enforcement needs a real-host experiment first (log `signedBy` beside
 * `address` for a session and compare), and a standalone story — per-player
 * keys, or accepting that standalone is unauthenticated. Until then the value
 * is extracted and passed so the experiment is a one-line change.
 */
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

/**
 * Everything this transport carries. Voice signalling shares the game's topic
 * because the two parties to a call are exactly the two players in the match —
 * a second topic and subscription would buy nothing. They diverge at the
 * statement store, which routes voice away from the game log.
 */
export type StoreStatement = GameStatement | VoiceStatement

type StatementCallback = (stmt: StoreStatement, signerSs58: string | null) => void

class StatementStoreHost {
  private store: HostStatementStore | null = null
  private onStatement: StatementCallback | null = null
  private subscription: { unsubscribe: () => void } | null = null
  private disposed = false
  private _connected = false
  /**
   * The in-flight (or settled) attach. Resolves to the store, or to null when
   * there is none to be had.
   *
   * `submit()` AWAITS this rather than reading `this.store`, and that is
   * load-bearing rather than tidy. `statementStore.connectRpc()` selects the
   * transport synchronously and fires `connect()` without awaiting it, so
   * `GameContext.createGame` reaches `applyAndSubmit` in the same synchronous
   * run — provably before `getStatementStore()` has resolved. Reading
   * `this.store` there found null and threw, `applyAndSubmit` swallowed it, and
   * the very first create/join of every host-mode session was dropped while the
   * UI said "Game created". The old SDK's `createStatementStore()` was
   * synchronous, which is why this could not happen before the migration.
   *
   * Doubles as the connect guard: non-null means attaching or attached.
   */
  private ready: Promise<HostStatementStore | null> | null = null
  /** One allocator for this client's signing account — every submit draws from
   *  it, so same-second statements cannot tie. */
  private readonly expiry = createExpiryAllocator()
  /** Last grant outcome surfaced, so one condition reports once. */
  private reportedGrantOutcome: GrantOutcome | null = null
  /** The product account the grants are for. Null until the host hands one over. */
  private account: string | null = null

  /** Signing/publishing cannot work and will not recover without a reload. */
  onFatalError?: (error: Error) => void

  /**
   * Attach to the host statement store and subscribe to the app topic.
   * Idempotent: concurrent callers share the one in-flight attach.
   *
   * `getStatementStore()` is ASYNC and resolves null outside a host container,
   * so both failure modes are reported rather than left silent — a store that
   * never arrives would otherwise look identical to a quiet game.
   */
  connect(onStatement: StatementCallback): Promise<void> {
    if (this.ready) return this.ready.then(() => undefined)
    // Reset the dispose latch: disconnect() sets it to stop in-flight callbacks
    // from the previous session, and leaving it set would make the singleton
    // permanently dead — a disconnect/reconnect cycle (host sign-out then
    // sign-in) would silently never resubscribe.
    this.disposed = false
    this.onStatement = onStatement
    this.ready = this.attach()
    return this.ready.then(() => undefined)
  }

  /** The attach itself. Never rejects: every failure is reported through
   *  onFatalError and resolves to null, so an awaiting submit gets a clear
   *  "not connected" rather than an unhandled rejection. */
  private async attach(): Promise<HostStatementStore | null> {
    let store: HostStatementStore | null
    try {
      store = await getStatementStore()
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err)
      console.error('[SS:Host] Statement store unavailable:', detail)
      this.onFatalError?.(new Error(`Statement Store unavailable: ${detail}. Reload to try again.`))
      return null
    }
    if (this.disposed) return null
    if (!store) {
      console.warn('[SS:Host] No host statement store — not inside a host container')
      this.onFatalError?.(
        new Error(
          'No Statement Store on this host. Multiplayer needs Polkadot Desktop, ' +
            'Polkadot Mobile, or the browser host.',
        ),
      )
      return null
    }

    this.store = store
    this._connected = true
    this.openSubscription()
    // Start the grant bootstrap now, so the round-trip is long done by the time
    // the player makes their first move.
    this.primeGrants()
    console.log('[SS:Host] Connected, subscription active')
    return store
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

  /**
   * Record the product account the host handed over, and prime its grants.
   * Called on every handover, not just the first — the same as spotlight-mesh's
   * `setProductAccount` — so a reconnect re-validates and a different identity
   * gets its own allowance rather than inheriting the previous one's memo.
   */
  setAccount(account: string | null): void {
    if (account !== this.account) this.reportedGrantOutcome = null
    this.account = account
    // Before the attach finishes, attach() primes once the store is up.
    if (this.store) this.primeGrants()
  }

  /** Ensure the grants are being established without blocking the caller.
   *  Idempotent and memoized per day-slot and account, so calling it on every
   *  submit costs nothing after the first. */
  private primeGrants(): void {
    const account = this.account
    if (!account) return // no identity to grant for yet — setAccount primes it
    void ensureStatementGrants(account).then((outcome) => {
      if (outcome === 'granted' || this.disposed || account !== this.account) return
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
  async submit(gameStmt: StoreStatement): Promise<void> {
    if (this.disposed) throw new Error('[SS:Host] Disposed')
    // Wait for the attach rather than reading this.store — see the note on
    // `ready`. The caller routinely arrives before getStatementStore() has
    // resolved, and failing there drops the first statement of the session.
    if (!this.ready) {
      // connect() has not been called: in practice the host has not handed over
      // a product account yet, so statementStore deferred. Fail fast and
      // honestly — the alternative that used to happen here was routing into
      // the standalone WebSocket transport, which hung forever.
      throw new Error('[SS:Host] Not connected — waiting for the host to hand over an account')
    }
    const store = await this.ready
    if (!store || this.disposed) {
      throw new Error('[SS:Host] Not connected — the host served no Statement Store')
    }

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
        proof = await store.createProofAuthorized(unsigned)
      } catch (err) {
        console.error('[SS:Host] ✗ createProofAuthorized failed:', err)
        throw err instanceof Error ? err : new Error(String(err))
      }

      try {
        await store.submit({ ...unsigned, proof } satisfies SignedStatement)
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
    this.ready = null
    this.onStatement = null
    this._connected = false
    console.log('[SS:Host] Disconnected')
  }
}

function decodeSignedStatement(
  stmt: SignedStatement,
): { gameStmt: StoreStatement; signedBy: string | null } | null {
  if (!stmt.data || stmt.data.length <= 2) return null
  try {
    const gameStmt = JSON.parse(utf8d.decode(fromHex(stmt.data))) as StoreStatement
    if (!gameStmt || typeof gameStmt.type !== 'string' || typeof gameStmt.gameId !== 'string') {
      return null
    }
    return { gameStmt, signedBy: ss58FromProof(stmt.proof) }
  } catch {
    return null
  }
}

export const statementStoreHost = new StatementStoreHost()
