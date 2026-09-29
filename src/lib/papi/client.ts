// PAPI Client Singleton — survives React re-renders, single connection.
//
// Chain access is transport-dependent, and this is the file that gets it wrong
// most expensively:
//
//   Host container (Desktop / Mobile / browser shell)
//     getHostProvider(genesisHash) tunnels every JSON-RPC call through the host
//     bridge, and the host owns the RPC or light-client connection. A product
//     must NOT open its own socket here: the desktop host serves the page from
//     `polkadot://<name>.<tld>`, where the browser rejects a `wss://` socket
//     outright, so the old always-WebSocket path could never connect on desktop
//     or mobile.
//
//   Standalone browser tab
//     No host, no bridge — one provider over the configured `wss://` endpoint
//     list, with PAPI v2's own failover.
//
// Chain access is for balances (and the game contract, once one is deployed).
// Game state does NOT come from here — it lives in the Statement Store. So a
// chain the host cannot serve degrades to "no balance", never to "no game", and
// callers are expected to gate on isPAPIClientReady().
import { createClient, AccountId } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws";
import { createInkSdk } from "@polkadot-api/sdk-ink";
import { getHostProvider, ChainNotSupportedError } from "@parity/product-sdk/host";
import { keccak256 } from "viem";
import { RPC_ENDPOINTS } from "../contracts/config";
import { ASSET_HUB_GENESIS } from "../triangle/constants";
import { isInHostContainer } from "../triangle/hostDetection";

let clientInstance: ReturnType<typeof createClient> | null = null;
let apiInstance: any | null = null;
let inkSdkInstance: ReturnType<typeof createInkSdk> | null = null;
let activeEndpoint: string | null = null;
let initPromise: Promise<void> | null = null;
let initialized = false;

function install(client: ReturnType<typeof createClient>, endpoint: string) {
  clientInstance = client;
  apiInstance = client.getUnsafeApi();
  inkSdkInstance = createInkSdk(client);
  activeEndpoint = endpoint;
}

/**
 * Host-routed client. Returns false when there is no provider for this chain,
 * which is a degraded-but-usable state, not a crash: the caller leaves the
 * client uninitialized and every read gates on isPAPIClientReady().
 */
async function initViaHost(): Promise<boolean> {
  try {
    // getHostProvider is async and returns null outside a host container; it
    // THROWS ChainNotSupportedError when the container is reachable but does
    // not carry this chain (the post-re-genesis case). Both are surfaced rather
    // than handed on as a provider that silently drops every request.
    const provider = await getHostProvider(ASSET_HUB_GENESIS);
    if (!provider) {
      console.warn("[PAPI] Host container reported no provider — chain reads disabled");
      return false;
    }
    install(createClient(provider), `host:${ASSET_HUB_GENESIS}`);
    console.log(`[PAPI] Connected over the host bridge (genesis ${ASSET_HUB_GENESIS.slice(0, 10)}…)`);
    return true;
  } catch (err) {
    if (err instanceof ChainNotSupportedError) {
      // Testnets get re-genesised. Name the fix rather than the symptom: the
      // app keeps working, it just cannot show a balance.
      console.error(
        `[PAPI] The host does not serve chain ${ASSET_HUB_GENESIS}. Balances are ` +
          "unavailable; game state is unaffected. If this chain was re-genesised, " +
          "set VITE_CHAIN_GENESIS to the current hash (read it with " +
          "chainSpec_v1_genesisHash).",
      );
      return false;
    }
    console.error("[PAPI] Host provider failed:", err);
    return false;
  }
}

/**
 * Standalone client: one provider over the whole endpoint list.
 *
 * PAPI v2's `getWsProvider` accepts an array and does failover and reconnect
 * itself, which replaces the hand-rolled Promise.any race this used to run (and
 * the `withPolkadotSdkCompat` wrapper, which v2 dropped along with the
 * `polkadot-api/polkadot-sdk-compat` subpath).
 */
function initViaWebSocket(): void {
  const client = createClient(getWsProvider(RPC_ENDPOINTS));
  install(client, RPC_ENDPOINTS.join(", "));
  console.log(`[PAPI] Connected over WebSocket, endpoints: ${RPC_ENDPOINTS.join(", ")}`);
}

async function initClient(): Promise<void> {
  if (await isInHostContainer()) {
    await initViaHost();
    return;
  }
  initViaWebSocket();
}

/**
 * Initialize the PAPI client. Safe to call multiple times.
 * Only a RESOLVED init is remembered — a failed one leaves the client
 * uninitialized so a later caller can retry.
 */
export async function initPAPIClient(): Promise<void> {
  if (clientInstance) return;
  if (initPromise) return initPromise;

  initPromise = initClient();

  try {
    await initPromise;
    initialized = clientInstance !== null;
  } finally {
    initPromise = null;
  }
}

/**
 * Returns true if the PAPI client has been initialized. Chain reads MUST gate
 * on this: inside a host that does not serve the configured chain, there is no
 * client and that is an expected state.
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
 * Get the PAPI client singleton. Throws if called before initPAPIClient()
 * completes, or when the host serves no provider for this chain.
 */
export function getPAPIClient(): {
  client: ReturnType<typeof createClient>;
  api: any;
  inkSdk: ReturnType<typeof createInkSdk>;
} {
  if (!clientInstance) {
    throw new Error('[PAPI] Client not initialized. Call initPAPIClient() first and gate reads on isPAPIClientReady().');
  }
  return {
    client: clientInstance,
    api: apiInstance,
    inkSdk: inkSdkInstance!,
  };
}

/**
 * Returns the currently active RPC endpoint, or `host:<genesis>` when the
 * connection is tunnelled through the host bridge.
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
