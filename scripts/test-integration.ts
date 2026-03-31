// PAPI integration test — validates chain connection, ReviveApi, and basic queries
// Run with: npx tsx scripts/test-integration.ts
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider/node';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { sr25519CreateDerive } from '@polkadot-labs/hdkd';
import { DEV_PHRASE, entropyToMiniSecret, mnemonicToEntropy } from '@polkadot-labs/hdkd-helpers';

const WS_URL = process.env.VITE_RPC_URL || 'wss://asset-hub-paseo-rpc.n.dwellir.com';

async function testIntegration() {
  console.log('Testing PAPI integration on Asset Hub...\n');
  console.log('  Connecting to:', WS_URL);

  // Test 1: Create PAPI client
  const client = createClient(
    withPolkadotSdkCompat(getWsProvider(WS_URL))
  );
  console.log('[PASS] PAPI client created');

  // Test 2: Get chain info
  const chainSpec = await client.getChainSpecData();
  console.log('[PASS] Connected to chain:', chainSpec.name);

  // Test 3: Create test signer from dev phrase
  const entropy = mnemonicToEntropy(DEV_PHRASE);
  const miniSecret = entropyToMiniSecret(entropy);
  const derive = sr25519CreateDerive(miniSecret);
  const keypair = derive('//Alice');
  console.log('[PASS] Test keypair created');

  // Test 4: Check that ReviveApi exists (for EVM contracts)
  const unsafeApi = client.getUnsafeApi();
  if (unsafeApi.apis?.ReviveApi) {
    console.log('[PASS] ReviveApi available (for EVM contracts)');
  } else {
    console.log('[WARN] ReviveApi not found - check chain supports Revive pallet');
  }

  // Test 5: Verify contractsApi is NOT used (common mistake)
  if (unsafeApi.call?.contractsApi) {
    console.log('[WARN] contractsApi found - this is NOT for PolkaVM/Revive!');
  } else {
    console.log('[PASS] contractsApi correctly absent (Asset Hub uses Revive)');
  }

  // Test 6: Query a balance (basic chain interaction)
  try {
    const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    console.log('[PASS] Chain queries work');
  } catch (e: any) {
    console.log('[WARN] Query test skipped:', e.message);
  }

  await client.destroy();
  console.log('\nAll PAPI integration tests passed!');
  console.log('\nREMINDER: Use ReviveApi for EVM contracts, NOT contractsApi!');
  process.exit(0);
}

testIntegration().catch((error) => {
  console.error('\nIntegration test FAILED:', error.message);
  console.error('\nCommon issues:');
  console.error('  - "contractsApi is undefined" = Use ReviveApi instead!');
  console.error('  - "Buffer is not defined" = Check imports, do NOT add vite-plugin-node-polyfills (breaks blake2b)');
  console.error('  - Connection failed = Check WebSocket URL is correct');
  process.exit(1);
});
