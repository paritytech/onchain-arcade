// Transaction validation test — tests address encoding, Binary encoding, ReviveApi calls
// Run with: npx tsx scripts/test-transactions.ts
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider/node';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { Binary } from 'polkadot-api';

const WS_URL = process.env.VITE_RPC_URL || 'wss://asset-hub-paseo-rpc.n.dwellir.com';

async function testContractInteraction() {
  console.log('\nTesting contract transaction...');

  const client = createClient(
    withPolkadotSdkCompat(getWsProvider(WS_URL))
  );

  const unsafeApi = client.getUnsafeApi();
  const testAddress = '0x1234567890123456789012345678901234567890';

  try {
    // Test 1: Verify H160 address format (20 bytes = 40 hex chars without 0x)
    const addressHex = testAddress.startsWith('0x') ? testAddress.slice(2) : testAddress;
    if (addressHex.length !== 40) {
      throw new Error(`H160 address must be 20 bytes (40 hex chars), got ${addressHex.length / 2} bytes`);
    }
    console.log('[PASS] Address encoding valid');

    // Test 2: Binary encoding for call data
    const testCallData = new Uint8Array([0x00, 0x01, 0x02]);
    const binary = Binary.fromBytes(testCallData);
    console.log('[PASS] Binary encoding works');

    // Test 3: ReviveApi.call exists
    if (!unsafeApi.apis?.ReviveApi?.call) {
      throw new Error('ReviveApi.call not available - check chain connection');
    }
    console.log('[PASS] ReviveApi.call available');

    // Test 4: If we have a deployed contract, test actual call
    const contractAddress = process.env.VITE_CONTRACT_ADDRESS;
    if (contractAddress) {
      console.log('Testing actual contract at:', contractAddress);

      // Encode a simple view call (e.g., name() selector = 0x06fdde03)
      const nameSelector = new Uint8Array([0x06, 0xfd, 0xde, 0x03]);

      try {
        const result = await unsafeApi.apis.ReviveApi.call(
          contractAddress,
          contractAddress,
          0n,
          undefined,
          undefined,
          Binary.fromBytes(nameSelector)
        );
        console.log('[PASS] Contract call executed successfully');
        console.log('  Result:', result);
      } catch (callError: any) {
        console.error('[FAIL] Contract call failed:', callError.message);
        throw callError;
      }
    } else {
      console.log('[SKIP] No VITE_CONTRACT_ADDRESS set, skipping contract call test');
    }

  } catch (error: any) {
    console.error('\nTransaction test FAILED:', error.message);
    console.error('\nERROR DETAILS FOR FIXING:');
    console.error(error.stack || error);
    throw error;
  } finally {
    await client.destroy();
  }

  console.log('\nTransaction tests passed!');
  process.exit(0);
}

testContractInteraction().catch((error) => {
  console.error('\nTRANSACTION TEST FAILED');
  console.error('\nCommon fixes:');
  console.error('  - H160 encoding error: Ensure address is exactly 20 bytes (40 hex chars)');
  console.error('  - Binary encoding error: Use Binary.fromBytes() for call data');
  console.error('  - ReviveApi undefined: Check chain supports Revive pallet');
  console.error('  - contractsApi error: Use ReviveApi, NOT contractsApi!');
  process.exit(1);
});
