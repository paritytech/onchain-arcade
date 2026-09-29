// Derive the DotNS identifier the host bound this product under.
//
// The host rejects a product account whose identifier does not match its own
// binding — `RequestCredentialsErr::DomainNotValid`, or a bare `Unknown` —
// before the signer is ever reached. No product account means no wallet and no
// Statement Store signing, so getting this wrong stops the whole app.
//
// The binding identifier comes from the URL, and the three shells disagree
// about what that URL looks like:
//
//   dot://<name>.<suffix>          → <name>.<suffix>   native container, exact
//   <name>.<suffix>                → as-is             desktop serves the name
//   app.<name>.<suffix>            → <name>.<suffix>   dotns-sdk publishes each
//                                                      executable under its
//                                                      `kind` subdomain
//   <name>.app.<root>.<tld>        → <name>.<suffix>   browser shell sandbox
//   app.<name>.<root>.<tld>        → <name>.<suffix>   the same executable
//                                                      subdomain, from the web
//                                                      shell's root
//   <name>.<root>.<tld>            → <name>.<suffix>   (.dot.li, .paseo.li, …)
//   localhost:N                    → localhost:N       dev preview
//
// The suffix is the NETWORK's DotNS TLD (../triangle/constants.ts), not a
// constant: paseo-next-v2 binds under `.paseo` where dot.li binds under `.dot`.
//
// Mirrors `deriveSelfDotNs` in paritytech/host-playground (apps/app/lib/dotns.ts),
// the reference implementation for this rule.
import { DOTNS_SUFFIX } from '../triangle/constants'

export function productIdentifierFrom(
  location: { hostname: string; host: string; protocol?: string },
  suffix: string = DOTNS_SUFFIX,
): string {
  const hostname = location.hostname.toLowerCase()
  const host = location.host.toLowerCase()

  // A native container already exposes the exact binding identifier.
  if (location.protocol === 'dot:') return hostname

  // Dev preview: the desktop binds local URLs under "localhost[:port]".
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) {
    return host
  }

  const segments = hostname.split('.')

  // Already a dotNS name. Two segments is the name itself; more means an
  // executable subdomain (`app.<name>.<suffix>`) whose binding is the root.
  if (hostname.endsWith(`.${suffix}`)) {
    return segments.length > 2 ? segments.slice(-2).join('.') : hostname
  }

  // A web shell: the registrable root is the last two segments (dot.li,
  // paseo.li, …), so the label is everything before it. An `app` label is
  // infrastructure, not part of the name, and it appears on BOTH sides of the
  // label — `<name>.app.<root>.<tld>` from the browser shell sandbox,
  // `app.<name>.<root>.<tld>` from the executable subdomain — so both are
  // stripped. Stripping only the trailing one leaves the leading form claiming
  // `app.<name>.<suffix>`, which nothing is bound to.
  if (segments.length >= 3) {
    let label = segments.slice(0, -2)
    if (label[label.length - 1] === 'app') label = label.slice(0, -1)
    if (label[0] === 'app') label = label.slice(1)
    if (label.length > 0) return `${label.join('.')}.${suffix}`
  }

  // Unrecognised. Hand back the host rather than invent a name: a wrong guess
  // would bind to somebody else's product identity, and the host refusing an
  // honest value is the better failure.
  return host
}

export const PRODUCT_IDENTIFIER =
  typeof window === 'undefined' ? '' : productIdentifierFrom(window.location)

// Logged unconditionally at startup. Which identifier was derived, and from
// which URL, is the first thing anyone needs when the host refuses a product
// account, and nothing else records it.
if (typeof window !== 'undefined') {
  console.log('[Host] Product identifier:', PRODUCT_IDENTIFIER, {
    origin: `${window.location.protocol}//${window.location.host}`,
    suffix: `.${DOTNS_SUFFIX}`,
  })
}
