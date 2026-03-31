// PAPI Client Singleton — survives React re-renders, single connection
// In host mode (dotli/Triangle): uses host's chain provider via product-sdk
// In standalone mode: probes multiple WS endpoints with timeout for resilience
import { createClient, AccountId } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { createInkSdk } from "@polkadot-api/sdk-ink";
import { keccak256 } from "viem";
import { RPC_ENDPOINTS } from "../contracts/config";
import { isInTriangleHost } from "../triangle/hostDetection";
import { WELL_KNOWN_CHAINS } from "../triangle/constants";

let clientInstance: ReturnType<typeof createClient> | null = null;
let apiInstance: any | null = null;
let inkSdkInstance: ReturnType<typeof createInkSdk> | null = null;
let activeEndpoint: string | null = null;
let initPromise: Promise<void> | null = null;

function createClientForEndpoint(endpoint: string) {
  const provider = getWsProvider(endpoint);
  const client = createClient(withPolkadotSdkCompat(provider));
  const api = client.getUnsafeApi();
  const inkSdk = createInkSdk(client);
  return { client, api, inkSdk };
}

/**
 * Initialize via host's chain provider (dotli or Triangle).
 * Uses createPapiProvider from product-sdk which communicates
 * through the host-container postMessage bridge.
 */
async function initHostClient(): Promise<void> {
  const { createPapiProvider } = await import("@novasamatech/product-sdk");
  const genesisHash = WELL_KNOWN_CHAINS["paseo-asset-hub"];
  const provider = createPapiProvider(genesisHash);
  const client = createClient(provider);
  const api = client.getUnsafeApi();
  const inkSdk = createInkSdk(client);

  // Verify connection with a simple query (5s timeout for host bridge)
  await Promise.race([
    api.query.System.Number.getValue(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Host chain provider timeout")), 5000)
    ),
  ]);

  clientInstance = client;
  apiInstance = api;
  inkSdkInstance = inkSdk;
  activeEndpoint = "host-provider";
  console.log("[PAPI] Connected via host chain provider");
}

/**
 * Initialize by racing all WS endpoints in parallel.
 * First endpoint that responds within 8s wins.
 */
async function initStandaloneClient(): Promise<void> {
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
 * In host mode: uses host's smoldot-backed chain provider (no WebSocket needed).
 * In standalone: probes WS endpoints with fallback.
 */
export async function initPAPIClient(): Promise<void> {
  if (clientInstance) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (isInTriangleHost()) {
      try {
        await initHostClient();
        return;
      } catch (err) {
        console.warn(
          "[PAPI] Host chain provider failed, falling back to WS:",
          err instanceof Error ? err.message : err
        );
      }
    }
    await initStandaloneClient();
  })();

  try {
    await initPromise;
  } finally {
    initPromise = null;
  }
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
    const endpoint = RPC_ENDPOINTS[0];
    const { client, api, inkSdk } = createClientForEndpoint(endpoint);
    clientInstance = client;
    apiInstance = api;
    inkSdkInstance = inkSdk;
    activeEndpoint = endpoint;
    console.warn(`[PAPI] Eager init with: ${endpoint}`);
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
  }
}
