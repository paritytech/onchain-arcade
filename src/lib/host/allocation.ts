/**
 * One place that knows how to ask the host for RFC-0010 resource allowances.
 *
 * The SDK returns outcomes in the same order as the request, so callers used to
 * keep a hand-maintained POSITIONAL index into their resource array:
 *
 *   const RESOURCES = [a, b, c];
 *   const THE_ONE_I_WANT = 1;      // reorder the array, read the wrong outcome
 *
 * That index is correct until someone edits the array above it, at which point
 * a granted allowance reads as refused with nothing to show for it. Outcomes
 * come back keyed by resource tag here instead.
 */

import {
  HostResponseDecodeError,
  requestResourceAllocation,
  type AllocatableResource,
  type AllocationOutcome,
} from '@parity/product-sdk/host'

import { isDeadlineError, withDeadline } from '../deadline'

/** Outcome per requested resource tag. Missing = the host named no outcome. */
export type AllocationOutcomes = Partial<Record<string, AllocationOutcome>>

export type AllocationResult =
  | { status: 'ok'; outcomes: AllocationOutcomes }
  /**
   * No allowance. `answered` separates the two cases, which need opposite
   * handling: the host REPLIED with an error (a decision — re-asking on a timer
   * just repeats it), versus the call never got an answer the client could read
   * (a transport fault — genuinely worth retrying).
   *
   * "Never got an answer" is not only a throw. Since product-sdk-host 0.19.0
   * the err channel also carries `HostResponseDecodeError`: the host replied,
   * but the reply could not be decoded — a protocol skew between the host build
   * and this product's `@parity/truapi`, or a channel that closed mid-call.
   * That is a fault, not a decision. Reading it as an answer is what makes it
   * dangerous: allowance.ts turns an answered error into 'rejected' and holds
   * that memo for the whole UTC day-slot, so one undecodable reply would stop
   * every statement submit until midnight while claiming the host said no.
   */
  | { status: 'error'; detail: string; answered: boolean }
  /** No answer inside the deadline — it may still land later. */
  | { status: 'timeout' }

/**
 * Request `resources` as one batch (one user prompt) and report the outcome for
 * each, keyed by tag. Every path logs: which resources a given host build
 * actually services is the fact worth having when statements stop linking, and
 * it is not recoverable from a shared console export afterwards.
 *
 * `timeoutMs` bounds the host round-trip. The bridge is known to wedge —
 * `requestResourceAllocation` has hung indefinitely on People-Next-System — and
 * an unbounded await here hangs whatever is waiting on the grant.
 */
export async function requestAllocation(
  resources: AllocatableResource[],
  timeoutMs: number,
  label: string,
): Promise<AllocationResult> {
  try {
    const result = await withDeadline(
      async () => requestResourceAllocation(resources),
      timeoutMs,
      `requestResourceAllocation(${label})`,
    )

    if (!result.ok) {
      const detail = describe(result.error)
      const decided = answered(result.error)
      console.warn('[Host:Alloc] Allocation failed', { label, detail, answered: decided })
      return { status: 'error', detail, answered: decided }
    }

    // AllocationOutcome is a plain string union — "Allocated" | "Rejected" |
    // "NotAvailable" — not a tagged object. Testing `.tag` on it can never
    // match: a granted allowance would read as refused.
    const outcomes: AllocationOutcomes = {}
    const summary: string[] = []
    result.value.forEach((outcome, i) => {
      const tag = resources[i]?.tag
      summary.push(`${tag ?? i}=${outcome}`)
      if (tag) outcomes[tag] = outcome
    })
    console.log('[Host:Alloc] Allowance outcomes', { label, outcomes: summary.join(' ') })
    return { status: 'ok', outcomes }
  } catch (err) {
    if (isDeadlineError(err)) {
      console.warn('[Host:Alloc] No answer inside the deadline', { label, timeoutMs })
      return { status: 'timeout' }
    }
    const detail = describe(err)
    console.warn('[Host:Alloc] Allocation threw', { label, detail })
    return { status: 'error', detail, answered: false }
  }
}

/**
 * Did the host actually decide, or did its answer just fail to arrive intact?
 *
 * Everything the SDK puts on the err channel is a decision EXCEPT
 * `HostResponseDecodeError`, which means the reply could not be decoded at all.
 */
function answered(error: unknown): boolean {
  return !(error instanceof HostResponseDecodeError)
}

/** The reason as a string, not only as an object: console exports routinely
 *  drop a second argument, which turns a real cause into a bare prefix. */
function describe(err: unknown): string {
  if (err instanceof Error) return err.message
  try {
    return JSON.stringify(err) ?? String(err)
  } catch {
    return String(err)
  }
}
