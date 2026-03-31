/**
 * Well-known chain genesis hashes from @novasamatech/product-sdk.
 * Use these with createPapiProvider(genesisHash) in host mode.
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
} as const;

export type ChainId = keyof typeof WELL_KNOWN_CHAINS;
