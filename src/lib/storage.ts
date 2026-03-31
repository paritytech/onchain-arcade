// Thin storage abstraction for wallet connection state.
// In Triangle host mode, the host manages the wallet so save/restore is a no-op.
// Browser localStorage is used in all modes for sync access.
// The hostLocalStorage API (async, cross-product) can be added later if needed.

let _initialized = false;

export async function initStorage(): Promise<void> {
  if (_initialized) return;
  _initialized = true;
  // Future: pre-load hostLocalStorage keys for cross-product data
}

export function getStorage(): Storage {
  return localStorage;
}
