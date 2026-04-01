// PAPI Client Singleton — survives React re-renders, single connection
// Always uses direct WebSocket for chain queries (balance, account info).
// The Triangle host does NOT support Paseo Asset Hub chain queries —
// it only provides wallet signing + Statement Store access.
// This matches the ignite repo pattern.
import { createClient, AccountId } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { createInkSdk } from "@polkadot-api/sdk-ink";
import { keccak256 } from "viem";
import { RPC_ENDPOINTS } from "../contracts/config";

let clientInstance: ReturnType<typeof createClient> | null = null;
let apiInstance: any | null = null;
let inkSdkInstance: ReturnType<typeof createInkSdk> | null = null;
let activeEndpoint: string | null = null;
let initPromise: Promise<void> | null = null;
let initialized = false;

function createClientForEndpoint(endpoint: string) {
  const provider = getWsProvider(endpoint);
  const client = createClient(withPolkadotSdkCompat(provider));
  const api = client.getUnsafeApi();
  const inkSdk = createInkSdk(client);
  return { client, api, inkSdk };
}

/**
 * Initialize by racing all WS endpoints in parallel.
 * First endpoint that responds within 8s wins.
 */
async function initClient(): Promise<void> {
  // Race all endpoints in parallel — first to respond wins
  const racePromises = RPC_ENDPOINTS.map(async (endpoint) => {
    const { client, api, inkSdk } = createClientForEndpoint(endpoint);
    await Promise.race([
      api.query.System.Number.getValue(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 8000)
      ),
    ]);
    return { client, api, inkSdk, endpoint };
  });

  // Promise.any polyfill (target is ES2020) — first to resolve wins
  const winner = await new Promise<{ client: ReturnType<typeof createClient>; api: any; inkSdk: ReturnType<typeof createInkSdk>; endpoint: string }>((resolve, reject) => {
    let rejectedCount = 0;
    const errors: unknown[] = [];
    racePromises.forEach((p, i) => {
      p.then(resolve, (err) => {
        errors[i] = err;
        if (++rejectedCount === racePromises.length) reject(errors);
      });
    });
  }).catch(() => null);

  if (winner) {
    clientInstance = winner.client;
    apiInstance = winner.api;
    inkSdkInstance = winner.inkSdk;
    activeEndpoint = winner.endpoint;
    console.log(`[PAPI] Connected to RPC: ${winner.endpoint}`);
  } else {
    console.warn("[PAPI] All endpoints failed, falling back to first endpoint");
    const fallback = RPC_ENDPOINTS[0];
    const { client, api, inkSdk } = createClientForEndpoint(fallback);
    clientInstance = client;
    apiInstance = api;
    inkSdkInstance = inkSdk;
    activeEndpoint = fallback;
  }
}

/**
 * Initialize the PAPI client. Safe to call multiple times.
 * Always uses direct WebSocket — the Triangle host does not support
 * Paseo Asset Hub for chain queries (only wallet signing + Statement Store).
 */
export async function initPAPIClient(): Promise<void> {
  if (clientInstance) return;
  if (initPromise) return initPromise;

  initPromise = initClient();

  try {
    await initPromise;
    initialized = true;
  } finally {
    initPromise = null;
  }
}

/**
 * Returns true if the PAPI client has been initialized.
 */
export function isPAPIClientReady(): boolean {
  return initialized && clientInstance !== null;
}

/**
 * Initialize the chain client — alias for initPAPIClient.
 */
export async function initChainClient(): Promise<void> {
  return initPAPIClient();
}

/**
 * Get the PAPI client singleton.
 * If not yet initialized, creates eagerly with first endpoint.
 */
export function getPAPIClient(): {
  client: ReturnType<typeof createClient>;
  api: any;
  inkSdk: ReturnType<typeof createInkSdk>;
} {
  if (!clientInstance) {
    throw new Error('[PAPI] Client not initialized. Call initPAPIClient() first.');
  }
  return {
    client: clientInstance,
    api: apiInstance,
    inkSdk: inkSdkInstance!,
  };
}

/**
 * Returns the currently active RPC endpoint URL.
 */
export function getActiveEndpoint(): string | null {
  return activeEndpoint;
}

// Cache H160 addresses to avoid repeated computation
const h160Cache = new Map<string, string>();

/**
 * Convert SS58 address to H160 (EVM) address.
 * Computed locally from public key (no RPC needed).
 * H160 = last 20 bytes of keccak256(AccountId.encode(ss58)).
 */
export function ss58ToH160(ss58Address: string): string {
  if (h160Cache.has(ss58Address)) {
    return h160Cache.get(ss58Address)!;
  }

  const publicKey = AccountId().enc(ss58Address);
  const hash = keccak256(publicKey); // '0x' + 64 hex chars
  const h160 = ("0x" + hash.slice(26)).toLowerCase(); // skip '0x' + first 12 bytes (24 hex chars)

  h160Cache.set(ss58Address, h160);
  return h160;
}

/**
 * Check if an SS58 address is mapped to the Revive EVM layer
 */
export async function isAccountMapped(address: string): Promise<boolean> {
  const { inkSdk } = getPAPIClient();
  return await inkSdk.addressIsMapped(address);
}

/**
 * Cleanup function to disconnect the client
 */
export function disconnectPAPIClient() {
  if (clientInstance) {
    clientInstance.destroy();
    clientInstance = null;
    apiInstance = null;
    inkSdkInstance = null;
    activeEndpoint = null;
    initialized = false;
  }
}
