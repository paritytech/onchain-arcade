/**
 * Returns true if the app is running inside a host environment:
 * - Webview host (Triangle Desktop/Mobile): sets window.__HOST_WEBVIEW_MARK__
 * - Iframe host (dotli web browser): window !== window.top
 *
 * The @novasamatech/product-sdk uses the same two checks internally
 * to select its transport (sandboxTransport vs defaultTransport).
 */
export function isInTriangleHost(): boolean {
  if (typeof window === 'undefined') return false;
  // Webview host (Electron/mobile)
  if ((window as any).__HOST_WEBVIEW_MARK__) return true;
  // Iframe host (dotli)
  try {
    return window !== window.top;
  } catch {
    // Cross-origin iframe — still a host
    return true;
  }
}
