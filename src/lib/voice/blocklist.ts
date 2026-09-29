/**
 * Locally blocked opponents.
 *
 * The safety floor for a 1-to-1 voice channel between strangers is mute, block
 * and report (Roblox's own documentation states all three). Identity here is a
 * wallet address with no reputation, no age signal and no friend graph, so the
 * channel is *more* exposed than a platform with accounts, not less — and the
 * documented harm is not evenly distributed: women and racial minorities report
 * markedly higher rates of verbal abuse in game voice chat, and many avoid it
 * entirely as a result.
 *
 * Mute and block ship here. **Report does not**, because there is no moderation
 * backend to receive one and a report button that goes nowhere is worse than an
 * absent one — it implies review that will never happen. Block is therefore
 * permanent and local, which is the fallback the research names when
 * report-with-review is not feasible.
 *
 * Scope is deliberately per-browser. Making it follow the account would mean
 * publishing a blocklist keyed by wallet address to a public statement store,
 * which broadcasts exactly who has blocked whom.
 */

const KEY = 'onchain-arcade/voice-blocklist/v1'

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function write(set: Set<string>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]))
  } catch {
    /* storage unavailable — the in-memory set still holds for this session */
  }
}

let cache: Set<string> | null = null

function blocked(): Set<string> {
  cache ??= read()
  return cache
}

export function isBlocked(address: string | null | undefined): boolean {
  return !!address && blocked().has(address)
}

export function blockAddress(address: string): void {
  const set = blocked()
  set.add(address)
  write(set)
}

export function unblockAddress(address: string): void {
  const set = blocked()
  set.delete(address)
  write(set)
}

export function blockedAddresses(): string[] {
  return [...blocked()]
}

/** Test seam — module-level cache. */
export function resetBlocklistCache(): void {
  cache = null
}
