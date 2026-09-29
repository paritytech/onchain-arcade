import { isInsideContainer, isInsideContainerSync } from '@parity/product-sdk/host';

/**
 * Synchronous host check, for call sites that cannot await — module scope, a
 * render body, an event handler that must decide now.
 *
 * `isInsideContainerSync` is the SDK's own marker check and covers all three
 * shells: the Desktop/Mobile webview sets `window.__HOST_WEBVIEW_MARK__`, and
 * the browser shell (dot.li) runs the product in an iframe. The local
 * `window !== window.top` fallback stays as a belt-and-braces check for a shell
 * whose marker the SDK has not learned yet.
 *
 * Prefer {@link isInHostContainer} where an await is possible: only the async
 * call completes the transport handshake, so this one can answer `true` for a
 * page that is framed but has no working bridge.
 */
export function isInTriangleHost(): boolean {
  if (typeof window === 'undefined') return false;
  if (isInsideContainerSync()) return true;
  try {
    return window !== window.top;
  } catch {
    // Cross-origin iframe — still a host.
    return true;
  }
}

/**
 * Authoritative host check: completes the SDK handshake with the container.
 * Returns false in a plain browser tab, where the standalone (browser wallet +
 * direct RPC) path takes over.
 */
export async function isInHostContainer(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    return await isInsideContainer();
  } catch {
    return false;
  }
}
