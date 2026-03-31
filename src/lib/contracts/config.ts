// Contract configuration — deploy scripts auto-update this file
// AGENT: Replace fallback address with actual deployed contract address

export const CONTRACT_ADDRESS: string =
  import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const CHAIN_CONFIG = {
  network: import.meta.env.VITE_NETWORK || 'paseo-asset-hub',
  rpcUrl: import.meta.env.VITE_RPC_URL || 'wss://asset-hub-paseo-rpc.n.dwellir.com',
} as const;

// WebSocket endpoint fallbacks (probed in order, first successful wins)
// This prevents heartbeat timeouts in sandboxed environments (Triangle host)
export const RPC_ENDPOINTS: string[] = [
  import.meta.env.VITE_RPC_URL as string,
  import.meta.env.VITE_RPC_FALLBACK_1 as string,
  import.meta.env.VITE_RPC_FALLBACK_2 as string,
].filter(Boolean).concat(
  // Hard-coded defaults so the app works even without .env
  'wss://asset-hub-paseo-rpc.n.dwellir.com',
  'wss://sys.ibp.network/asset-hub-paseo',
  'wss://pas-rpc.stakeworld.io/assethub',
  'wss://asset-hub-paseo-rpc.dwellir.com',
);
