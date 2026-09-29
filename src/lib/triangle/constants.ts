/**
 * Well-known chain genesis hashes. Name a chain to the host with one of these —
 * `getHostProvider(genesisHash)` in `lib/papi/client.ts` is how the app reaches
 * a chain inside a host container (the host owns the connection).
 */
export const WELL_KNOWN_CHAINS = {
  polkadot: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
  'polkadot-asset-hub': '0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f',
  kusama: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
  'kusama-asset-hub': '0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a',
  paseo: '0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f',
  'paseo-asset-hub': '0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2',
  westend: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
  'westend-asset-hub': '0x67f9723393ef76214df0118c34bbbd3dbebc8ed46a10973a8c969d48fe7598c9',
  // paseo-next-v2 Asset Hub, as used by ../spotlight-mesh. Testnets get
  // re-genesised (three hashes in one month for this one): if the host answers
  // "chain not supported", re-read the hash with chainSpec_v1_genesisHash
  // before debugging anything else.
  'paseo-asset-hub-next': '0x4349b00e54897e21196fd331015fc5be0f14e118beb0375ed2bb1793737bb57a',
} as const;

export type ChainId = keyof typeof WELL_KNOWN_CHAINS;

/**
 * The chain the app reads: Asset Hub, for account balances (and the game
 * contract, when one is deployed). `VITE_CHAIN_GENESIS` overrides it.
 *
 * Game state does NOT depend on this — it lives in the Statement Store, which
 * the host reaches over its own transport. A chain the host cannot serve
 * degrades to "no balance", not "no game".
 */
export const ASSET_HUB_GENESIS: `0x${string}` =
  (import.meta.env.VITE_CHAIN_GENESIS as `0x${string}` | undefined) ??
  WELL_KNOWN_CHAINS['paseo-asset-hub'];

/**
 * DotNS TLD per network. The host binds a product under `<label>.<suffix>` and
 * rejects a product account whose identifier does not match that binding, so
 * this tracks the network rather than being hardcoded: paseo-next-v2 reads its
 * TLD on-chain and it is `.paseo` there, where dot.li binds under `.dot`.
 *
 * Keys are lowercased on lookup — a hash pasted from a block explorer often
 * carries uppercase hex, and a case-sensitive miss here is invisible.
 */
const DOTNS_SUFFIX_BY_GENESIS: Record<string, string> = {
  [WELL_KNOWN_CHAINS['paseo-asset-hub']]: 'dot',
  [WELL_KNOWN_CHAINS['paseo-asset-hub-next']]: 'paseo',
};

/**
 * The DotNS TLD this build's chain binds products under.
 *
 * Resolution order: `VITE_DOTNS_SUFFIX`, then the table above keyed by the
 * resolved genesis, then `dot` with a loud warning. The last step matters
 * because `ASSET_HUB_GENESIS` is env-overridable: following the "set
 * VITE_CHAIN_GENESIS after a re-genesis" advice above puts a hash in play this
 * table has never seen, and silently guessing a TLD there would rebuild the
 * product identifier under the wrong suffix — the host then refuses the product
 * account with `DomainNotValid`, which is the very fault being recovered from.
 * `VITE_DOTNS_SUFFIX` exists so that can be answered without a code change.
 */
function resolveDotNsSuffix(): string {
  const override = import.meta.env.VITE_DOTNS_SUFFIX as string | undefined;
  if (override) return override.replace(/^\./, '').toLowerCase();

  const mapped = DOTNS_SUFFIX_BY_GENESIS[ASSET_HUB_GENESIS.toLowerCase()];
  if (mapped) return mapped;

  console.error(
    '[Triangle] No DotNS TLD known for this genesis — the host will refuse the ' +
      'product account with DomainNotValid, and there will be no wallet and no ' +
      "statements. Set VITE_DOTNS_SUFFIX to this network's TLD, or add the " +
      'genesis to DOTNS_SUFFIX_BY_GENESIS in src/lib/triangle/constants.ts.',
    { genesis: ASSET_HUB_GENESIS, fallback: 'dot' },
  );
  return 'dot';
}

export const DOTNS_SUFFIX: string = resolveDotNsSuffix();
