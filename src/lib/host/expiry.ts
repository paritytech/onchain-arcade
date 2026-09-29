/**
 * Statement Store expiry encoding. Pure logic — no host bridge, no chain — so
 * the arithmetic is unit-testable.
 *
 * The pallet packs expiry as a `u64`: `(expiration_epoch << 32) | sequence`.
 * The low word is a SEQUENCE NUMBER, and the store compares the whole u64 with
 * strictly-greater semantics when deciding whether a statement SUPERSEDES the
 * one already held on the same (account, channel).
 *
 * Two statements minted in the same wall-clock second with the same sequence
 * encode to the identical u64, and the store rejects the second as
 * `channelPriorityTooLow`. Two game moves inside one second is ordinary play,
 * so the sequence counts up per statement instead of staying at 0.
 *
 * The floor is per channel because supersession is scoped to a channel — that
 * is the only scope in which monotonicity is required, and the only one in
 * which it is harmless. A single shared floor overrides the caller's requested
 * duration and cannot survive a reload, which pins fresh statements below their
 * own retained predecessors for minutes.
 */

/** Floor key for statements submitted without a channel. The leading space
 *  keeps it out of the namespace of real (hex) channel ids. */
const UNCHANNELLED = ' unchannelled'

/**
 * Widest expiry a chain-reported floor may claim, as an offset from now. The
 * pallet's own ceiling is not exposed, so this is a sanity bound rather than a
 * mirror of it: anything past a day is a misparse, not a statement.
 */
export const MAX_FLOOR_HORIZON_SECS = 86_400

export interface ExpiryAllocator {
  /**
   * Next expiry for a statement living `durationSecs`, on `channel` (a stable
   * key for the channel id; omitted for unchannelled statements). Strictly
   * increasing within a channel.
   */
  next(durationSecs: number, channel?: string): bigint
  /**
   * Adopt a chain-reported minimum for `channel` after a priority rejection.
   * The chain is the source of truth for the floor: recomputing from the wall
   * clock can never clear a minimum a previous page load pinned high.
   *
   * Ignores a floor further than {@link MAX_FLOOR_HORIZON_SECS} ahead. The
   * minimum is scraped out of an untyped error, so a misparse is possible, and
   * adopting one would pin every later statement decades out — never expiring,
   * never freeing its allowance slot, until the account's `max_count` fills and
   * every submit fails. Returns whether the floor was taken, so a caller can
   * tell "adopted" from "ignored" rather than silently retrying unchanged.
   */
  raiseFloor(min: bigint, channel?: string): boolean
}

/**
 * One allocator per signing account. Every writer on that account must share
 * the instance — independent counters re-introduce the same-second tie this
 * exists to prevent.
 */
export function createExpiryAllocator(now: () => number = Date.now): ExpiryAllocator {
  const floors = new Map<string, bigint>()
  let sequence = 0n

  const nowSecs = () => BigInt(Math.floor(now() / 1000))

  return {
    next(durationSecs, channel = UNCHANNELLED) {
      const packed = ((nowSecs() + BigInt(durationSecs)) << 32n) | (sequence++ & 0xffff_ffffn)
      // Clamp only against this channel's own floor, and only when the natural
      // packing would tie or regress — which, within one second, it cannot,
      // since the sequence advanced.
      const floor = floors.get(channel)
      const value = floor !== undefined && packed <= floor ? floor + 1n : packed
      floors.set(channel, value)
      return value
    },
    raiseFloor(min, channel = UNCHANNELLED) {
      if (min >> 32n > nowSecs() + BigInt(MAX_FLOOR_HORIZON_SECS)) {
        console.warn('[Host:Expiry] Ignoring an implausible priority floor — reading it as a misparse', {
          min: String(min),
          expiration: new Date(Number(min >> 32n) * 1000).toISOString(),
          horizonSecs: MAX_FLOOR_HORIZON_SECS,
        })
        return false
      }
      const current = floors.get(channel)
      // Strictly-lower only. `next()` writes its own return value into the same
      // map, so `current` is usually the value the chain just rejected — and the
      // rejection this exists for is a TIE, where the reported minimum EQUALS
      // it. Refusing on equality skips the retry in exactly that case; adopting
      // it lets `next()` mint `floor + 1` and make progress.
      if (current !== undefined && min < current) return false
      floors.set(channel, min)
      return true
    },
  }
}

/** Unpack for assertions and diagnostics. */
export function unpackExpiry(packed: bigint): { expiration: bigint; sequence: bigint } {
  return { expiration: packed >> 32n, sequence: packed & 0xffff_ffffn }
}

/**
 * Signatures that mark an error as a PRIORITY rejection — the only errors whose
 * reported minimum means anything here.
 *
 * Gating on this matters more than it looks. The walk below reads numeric
 * fields out of an untyped error, and an unrelated failure carrying an
 * unrelated number would otherwise be read as a floor and pin the channel's
 * expiry to it. `min` on its own is far too common a key to walk for at all, so
 * it is not in the key list.
 */
const PRIORITY_REJECTION = /channel_?priority_?too_?low|expiry_?too_?low|account_?full/i

/**
 * Pull the store's reported minimum out of a priority rejection. There is no
 * typed `min_expiry` in the wire contract — the host surfaces it as a field, a
 * nested value, or embedded in a JSON error string — so this walks both shapes.
 * Returns null when the error is not a priority rejection, or names no minimum.
 */
export function priorityRejectionMinimum(err: unknown): bigint | null {
  if (!looksLikePriorityRejection(err)) return null

  const seen = new Set<unknown>()

  const walk = (node: unknown, depth: number): bigint | null => {
    if (node === null || node === undefined || depth > 4 || seen.has(node)) return null
    if (typeof node === 'string') {
      const m = /"?min_?expiry"?\s*[:=]\s*"?(\d+)"?/i.exec(node)
      return m ? BigInt(m[1]) : null
    }
    if (typeof node !== 'object') return null

    seen.add(node)
    const rec = node as Record<string, unknown>
    for (const key of ['min_expiry', 'minExpiry']) {
      const v = rec[key]
      if (typeof v === 'bigint') return v
      if (typeof v === 'number' || typeof v === 'string') {
        try {
          return BigInt(v)
        } catch {
          /* not numeric — keep walking */
        }
      }
    }
    for (const v of Object.values(rec)) {
      const found = walk(v, depth + 1)
      if (found !== null) return found
    }
    return null
  }

  return walk(err instanceof Error ? err.message : err, 0) ?? walk(err, 0)
}

/** Does this error name a priority rejection anywhere in its tags or text? */
function looksLikePriorityRejection(err: unknown): boolean {
  const seen = new Set<unknown>()

  const walk = (node: unknown, depth: number): boolean => {
    if (node === null || node === undefined || depth > 4 || seen.has(node)) return false
    if (typeof node === 'string') return PRIORITY_REJECTION.test(node)
    if (typeof node !== 'object') return false
    seen.add(node)
    // Keys as well as values: a tagged enum names the variant in `value`
    // (`{ tag: "ChannelPriorityTooLow" }`), but a map-shaped encoding names it
    // in the KEY (`{ channelPriorityTooLow: {...} }`), which a values-only walk
    // never sees.
    return Object.entries(node as Record<string, unknown>).some(
      ([k, v]) => PRIORITY_REJECTION.test(k) || walk(v, depth + 1),
    )
  }

  if (err instanceof Error && PRIORITY_REJECTION.test(err.message)) return true
  return walk(err, 0)
}
