/**
 * The two grants the host needs before it will sign and submit a statement.
 * Missing either one is what "moves never reach the other player" looks like.
 *
 *  1. `StatementStoreAllowance` (RFC-0010, on-chain). This is what gives the
 *     host a PROVER for the product account. Without it `createProofAuthorized`
 *     fails outright with `StatementProofErr::UnableToSign`, so no game
 *     statement is ever published.
 *  2. The `StatementSubmit` host permission, which gates the submit itself.
 *
 * They are NOT interchangeable and they have different lifetimes:
 *
 * - The allowance is an on-chain grant the pallet keys by day number since the
 *   Unix epoch, and it reaps a lapsed slot. `requestResourceAllocation` is also
 *   not idempotent — each call re-shows the host modal, burns a quota slot, and
 *   churns the account nonce, which can race a concurrent submit into a `Stale`
 *   error. So it is requested at most once per day-slot, and the memo records
 *   WHICH slot was granted: a plain boolean silently stops every submit after
 *   the first UTC-midnight rollover.
 * - The permission is held by the host worker, and the browser shell builds a
 *   fresh worker per product render — so every reload drops it. It must be
 *   re-requested, and AWAITED, on every bootstrap. Firing it without awaiting
 *   lets the first move reach `createProofAuthorized` with no prover attached,
 *   which the host refuses locally in a few milliseconds without ever asking
 *   the phone.
 *
 * Both host calls go through `withDeadline`: the bridge is known to wedge, and
 * an unbounded await here would hang the first move with the hung promise
 * memoized.
 *
 * ## Retry policy
 *
 * The statement transport primes this on every submit, so anything that re-arms
 * the memo unconditionally re-runs the whole bootstrap — a 90 s permission
 * dialog plus a 120 s allocation — on every move. The outcomes are therefore
 * split by what they say about retrying:
 *
 *   granted     memo kept. Nothing more to do.
 *   timeout     memo kept. The raced request may still allocate late, and
 *               re-firing would double-prompt.
 *   rejected    memo kept for the day-slot. The user said no; asking again on
 *               the next move is nagging, not recovery.
 *   unavailable memo re-armed behind {@link RETRY_BACKOFF_MS}. The bridge was
 *               not there to answer — genuinely transient, but retried on its
 *               own clock rather than the player's.
 */

import { isInsideContainer, requestPermission, type AllocatableResource } from '@parity/product-sdk/host'

import { DEADLINE, withDeadline } from '../deadline'
import { requestAllocation } from './allocation'

/** The one resource this module needs: the prover behind createProofAuthorized. */
const RESOURCES: AllocatableResource[] = [{ tag: 'StatementStoreAllowance', value: undefined }]
const STATEMENT_RESOURCE = 'StatementStoreAllowance'

/** localStorage key holding the day-slot number of the last granted allowance. */
const ALLOWANCE_SLOT_KEY = 'onchain-arcade/statement-store-allowance/v1'
/** The pallet's allowance slot period: one day. */
const SLOT_PERIOD_MS = 86_400_000
/**
 * The allowance grant is an on-chain extrinsic the host has to sign, which in
 * the browser shell means a round-trip to the phone and a human tapping
 * approve. Give it longer than DEADLINE.hostDialog: nothing blocks on this
 * bootstrap (the transport primes it and moves on), so a generous bound costs
 * nothing and a tight one throws away a grant that was about to land.
 */
const ALLOWANCE_TIMEOUT_MS = 120_000

/**
 * How long to wait before re-attempting after the host bridge was unreachable.
 * Comfortably longer than a burst of moves, so a bridge that stays down costs
 * one bootstrap a minute rather than one per move.
 */
export const RETRY_BACKOFF_MS = 60_000

/** Day number since the Unix epoch — the bucket the pallet keys grants under. */
function currentSlot(): number {
  return Math.floor(Date.now() / SLOT_PERIOD_MS)
}

function grantedThisSlot(): boolean {
  try {
    return Number(localStorage.getItem(ALLOWANCE_SLOT_KEY)) === currentSlot()
  } catch {
    return false // storage unavailable — fall back to the in-session memo
  }
}

/** Records the slot the grant was REQUESTED under, not the slot it landed in:
 *  the round-trip is human-paced (a tap on a phone) and can cross UTC midnight,
 *  and the pallet keyed the grant under the earlier day. */
function rememberGrant(slot: number): void {
  try {
    localStorage.setItem(ALLOWANCE_SLOT_KEY, String(slot))
  } catch {
    /* storage unavailable — the in-session memo still prevents re-prompting */
  }
}

let inFlight: Promise<GrantOutcome> | null = null
/** Slot the memo belongs to, so a session open across the rollover re-validates
 *  instead of trusting a grant that has since lapsed. */
let memoSlot: number | null = null
/** Earliest time a re-armed memo may fire again. See the retry policy above. */
let retryAfter = 0

/** Test seam: memo, slot and backoff are module state. */
export function resetStatementGrants(): void {
  inFlight = null
  memoSlot = null
  retryAfter = 0
}

/**
 * What came of asking. See the retry policy in the module header for how each
 * one affects the memo.
 */
export type GrantOutcome =
  /** Signing and submitting will work. */
  | 'granted'
  /** The host never answered — a prompt may still be waiting on the phone. */
  | 'timeout'
  /** The host answered no. */
  | 'rejected'
  /** The bridge was not reachable; retried on its own clock. */
  | 'unavailable'

/** What to tell the player for each way the grants can fail. Each names the
 *  action that actually clears it — the three are not interchangeable, which is
 *  why this reports an outcome rather than a boolean. */
export const GRANT_FAILURE_COPY: Record<Exclude<GrantOutcome, 'granted'>, string> = {
  timeout:
    'The host has not confirmed permission to publish game moves yet. If the ' +
    'Polkadot app on your phone is showing an approval request, answer it — ' +
    'this clears without a reload.',
  rejected:
    'Permission to publish game moves was declined, so moves will not reach ' +
    'your opponent. Reload to ask again.',
  unavailable:
    'Cannot reach the host to request permission to publish game moves. ' +
    'Retrying — if this persists, reopen the arcade from Polkadot Desktop, ' +
    'Mobile, or the browser host.',
}

/**
 * Ensure this product account can sign and submit statements. Await this before
 * the first `createProofAuthorized`. Safe to call on every submit: at most one
 * host prompt per day-slot, single-flighted within the session.
 *
 * Returns WHICH outcome, not just whether it worked. The three failures need
 * three different things from the player — approve a prompt, reload, or wait —
 * and a boolean cannot say which.
 */
export function ensureStatementGrants(): Promise<GrantOutcome> {
  // Drop a memo made in an earlier slot: the grant it stands for has lapsed, so
  // the not-idempotent argument for keeping it no longer applies.
  if (inFlight && memoSlot !== currentSlot()) inFlight = null
  if (inFlight) return inFlight
  // Inside the backoff window, report the last verdict without re-asking.
  if (Date.now() < retryAfter) return Promise.resolve('unavailable')

  memoSlot = currentSlot()
  const attempt = bootstrap()
  inFlight = attempt.then(
    (result) => {
      if (result === 'unavailable') rearmAfterBackoff()
      return result
    },
    (err): GrantOutcome => {
      // An unexpected throw is the same class as 'unavailable': nothing was
      // allocated and the cause may be transient.
      console.warn('[Host:Allowance] Bootstrap threw', err)
      rearmAfterBackoff()
      return 'unavailable'
    },
  )
  return inFlight
}

function rearmAfterBackoff(): void {
  inFlight = null
  retryAfter = Date.now() + RETRY_BACKOFF_MS
  console.log('[Host:Allowance] Will retry', {
    inSecs: RETRY_BACKOFF_MS / 1000,
    reason: 'the host bridge did not answer',
  })
}

async function bootstrap(): Promise<GrantOutcome> {
  // Every exit announces itself. Silence is ambiguous between "not in a host",
  // "already granted this slot" and "still waiting on the host", which are
  // three very different problems that look identical in a log.
  console.log('[Host:Allowance] Establishing statement grants')

  // Outside a host container there is no allowance model at all (standalone
  // browser mode signs with its own key) — nothing to request, nothing to fail.
  if (!(await isInsideContainer())) {
    console.log('[Host:Allowance] Not inside a host container — skipped')
    return 'granted'
  }

  // Always awaited, even when the allowance memo is set — see the header note
  // on the two lifetimes. Cheap when the worker already holds it.
  await requestSubmitPermission()

  // Skip only the expensive, re-prompting allocation round-trip.
  const slot = currentSlot()
  if (grantedThisSlot()) {
    console.log('[Host:Allowance] Allowance already granted in this slot', { slot })
    return 'granted'
  }

  console.log('[Host:Allowance] Requesting the statement-store allowance', {
    slot,
    timeoutMs: ALLOWANCE_TIMEOUT_MS,
  })

  const result = await requestAllocation(RESOURCES, ALLOWANCE_TIMEOUT_MS, 'Statements')

  if (result.status === 'timeout') {
    // Either nobody approved the prompt on the phone, or this host build does
    // not answer for this resource at all. The memo is kept regardless: the
    // request may still allocate late, and re-firing would double-prompt.
    console.warn('[Host:Allowance] No answer from the host', { slot, timeoutMs: ALLOWANCE_TIMEOUT_MS })
    return 'timeout'
  }

  if (result.status === 'error') {
    // A host that ANSWERED with an error has decided; re-asking on a timer just
    // repeats it. Only a call that never reached the host is transient.
    return result.answered ? 'rejected' : 'unavailable'
  }

  const outcome = result.outcomes[STATEMENT_RESOURCE]
  if (outcome !== 'Allocated') {
    // The host answered, and the answer was no. Do NOT remember it as a grant —
    // otherwise the ask is skipped for the rest of the day and every submit
    // fails. The memo still holds for this slot, so the next move does not
    // re-prompt; a reload is the way to ask again.
    console.warn('[Host:Allowance] Allowance not granted', { slot, outcome: outcome ?? null })
    return 'rejected'
  }

  rememberGrant(slot)
  console.log('[Host:Allowance] Allowance granted', { slot })
  return 'granted'
}

/**
 * The host-side gate on the submit itself. Never fatal on its own: the host
 * still JIT-prompts at submit time, so a failure here costs a prompt rather
 * than the move.
 */
async function requestSubmitPermission(): Promise<void> {
  try {
    const perm = await withDeadline(
      async () => requestPermission({ tag: 'StatementSubmit', value: undefined }),
      DEADLINE.hostDialog,
      'requestPermission(StatementSubmit)',
    )
    if (!perm.ok || perm.value === false) {
      console.warn('[Host:Allowance] StatementSubmit permission not granted')
    }
  } catch (err) {
    console.warn('[Host:Allowance] StatementSubmit permission failed', err)
  }
}
