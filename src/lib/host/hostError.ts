// Pull the meaningful variant name out of a host error.
//
// Host calls reject with `scale.CallErrorValue<Versioned…Error>`, which nests
// the failure two envelopes deep and puts the TRANSPORT tag on the OUTSIDE:
//
//   { tag: "Domain", value: { tag: "V1", value: { tag: "NotConnected" } } }
//    └ transport         └ version          └ the variant we actually want
//
// The other transport variants carry no domain error at all — `Denied`,
// `Unsupported`, and `MalformedFrame` / `HostFailure` with a `{ reason }`.
//
// Stopping at the first hop reports "Domain" for every failure, which loses
// `NotConnected` — the one variant that means "not signed in yet" rather than
// "broken", and the difference between waiting for sign-in and showing an error.

/** Envelopes to unwrap rather than report: the transport tag and any version. */
function isEnvelope(tag: string): boolean {
  return tag === 'Domain' || /^V\d+$/.test(tag)
}

/**
 * The variant name a host error ultimately reports — "NotConnected",
 * "DomainNotValid", "Denied", "HostFailure: <reason>" — or null when the value
 * is not a tagged host error at all.
 */
export function hostErrorTag(error: unknown): string | null {
  let node: unknown = error
  // Domain → V1 → variant is three hops; the bound is slack, not a guess.
  for (let depth = 0; depth < 4; depth++) {
    if (typeof node !== 'object' || node === null || !('tag' in node)) return null
    const tagged = node as { tag: unknown; value?: unknown }
    const tag = String(tagged.tag)
    if (!isEnvelope(tag)) {
      const reason = (tagged.value as { reason?: string } | undefined)?.reason
      return reason ? `${tag}: ${reason}` : tag
    }
    // A transport variant with no payload (`Denied`, `Unsupported`) never gets
    // here, but an envelope whose value is missing would otherwise report null
    // where the tag itself is the whole answer.
    if (tagged.value === undefined) return tag
    node = tagged.value
  }
  return null
}
