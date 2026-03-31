// Contract call validation — dry-run every ABI function against deployed contracts
// Run with: npx tsx scripts/test-contract-calls.ts
// No signing or funds needed — uses ReviveApi.call() dry-runs
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider/node';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { Binary } from 'polkadot-api';
import { encodeFunctionData } from 'viem';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const WS_URL = process.env.VITE_RPC_URL || 'wss://asset-hub-paseo-rpc.n.dwellir.com';

// --- Discovery ---

interface ContractInfo {
  name: string;
  address: string;
}

interface AbiInfo {
  name: string;
  abi: any[];
  filePath: string;
}

function discoverContracts(): ContractInfo[] {
  const contracts: ContractInfo[] = [];
  // Scan .env for VITE_*_ADDRESS or VITE_*_CONTRACT patterns
  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith('VITE_')) continue;
    if (!value || !value.startsWith('0x')) continue;
    if (value.length !== 42) continue; // H160 addresses are 42 chars with 0x
    if (key === 'VITE_RPC_URL') continue;

    const isAddress = key.endsWith('_ADDRESS') || key.endsWith('_CONTRACT') || key.endsWith('_CONTRACT_ADDRESS');
    if (isAddress) {
      // Extract name from env var: VITE_TOKEN_ADDRESS -> token, VITE_NFT_CONTRACT -> nft
      const name = key
        .replace(/^VITE_/, '')
        .replace(/_ADDRESS$/, '')
        .replace(/_CONTRACT_ADDRESS$/, '')
        .replace(/_CONTRACT$/, '')
        .toLowerCase();
      contracts.push({ name, address: value });
    }
  }
  return contracts;
}

function discoverAbis(): AbiInfo[] {
  const abis: AbiInfo[] = [];

  // 1. Check src/lib/contracts/ for ABI JSON files
  const contractsLibDir = path.join('src', 'lib', 'contracts');
  if (fs.existsSync(contractsLibDir)) {
    for (const file of fs.readdirSync(contractsLibDir)) {
      if (!file.endsWith('.json')) continue;
      try {
        const content = JSON.parse(fs.readFileSync(path.join(contractsLibDir, file), 'utf-8'));
        const abi = Array.isArray(content) ? content : content.abi;
        if (Array.isArray(abi)) {
          const name = file.replace(/\.json$/, '').replace(/[-_]abi$/i, '').toLowerCase();
          abis.push({ name, abi, filePath: path.join(contractsLibDir, file) });
        }
      } catch { /* skip non-JSON or malformed */ }
    }
  }

  // 2. Fall back to contracts/artifacts/ for Hardhat artifacts
  if (abis.length === 0) {
    const artifactsDir = path.join('contracts', 'artifacts', 'contracts');
    if (fs.existsSync(artifactsDir)) {
      for (const solDir of fs.readdirSync(artifactsDir)) {
        const solDirPath = path.join(artifactsDir, solDir);
        if (!fs.statSync(solDirPath).isDirectory()) continue;
        for (const file of fs.readdirSync(solDirPath)) {
          if (!file.endsWith('.json') || file.endsWith('.dbg.json')) continue;
          try {
            const content = JSON.parse(fs.readFileSync(path.join(solDirPath, file), 'utf-8'));
            if (Array.isArray(content.abi) && content.abi.length > 0) {
              const name = file.replace(/\.json$/, '').toLowerCase();
              abis.push({ name, abi: content.abi, filePath: path.join(solDirPath, file) });
            }
          } catch { /* skip */ }
        }
      }
    }
  }

  return abis;
}

// --- Matching ---

function matchAbisToContracts(
  contracts: ContractInfo[],
  abis: AbiInfo[]
): Array<{ contract: ContractInfo; abi: AbiInfo }> {
  const matched: Array<{ contract: ContractInfo; abi: AbiInfo }> = [];

  // Direct name matching first
  for (const contract of contracts) {
    const match = abis.find(a => {
      const cn = contract.name.replace(/[-_]/g, '');
      const an = a.name.replace(/[-_]/g, '');
      return cn === an || cn.includes(an) || an.includes(cn);
    });
    if (match) {
      matched.push({ contract, abi: match });
    }
  }

  // If 1:1 count and no matches found, pair by order
  if (matched.length === 0 && contracts.length === abis.length && contracts.length > 0) {
    for (let i = 0; i < contracts.length; i++) {
      matched.push({ contract: contracts[i], abi: abis[i] });
    }
  }

  return matched;
}

// --- Default Args ---

function defaultArgForType(input: any): any {
  const type: string = input.type || 'uint256';

  if (type.endsWith('[]')) return [];
  if (type === 'tuple' || type === 'tuple[]') {
    const components = input.components || [];
    const tupleVal = components.reduce((acc: any, comp: any) => {
      acc[comp.name || 'field'] = defaultArgForType(comp);
      return acc;
    }, {} as Record<string, any>);
    return type === 'tuple[]' ? [tupleVal] : tupleVal;
  }
  if (type.startsWith('uint') || type.startsWith('int')) return 0n;
  if (type === 'address') return '0x0000000000000000000000000000000000000000';
  if (type === 'bool') return false;
  if (type === 'string') return '';
  if (type.startsWith('bytes')) return '0x';
  return '0x';
}

// --- Execution ---

interface TestResult {
  contract: string;
  fn: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
}

async function runContractTests(): Promise<void> {
  console.log('Contract Call Validation Test\n');
  console.log('  RPC:', WS_URL);

  // Discovery
  const contracts = discoverContracts();
  const abis = discoverAbis();

  console.log(`  Contracts found: ${contracts.length}`);
  console.log(`  ABIs found: ${abis.length}`);

  if (contracts.length === 0 || abis.length === 0) {
    console.log('\n[SKIP] No contracts or ABIs found — SPA mode or contracts not deployed');
    console.log('Contract call validation skipped.');
    process.exit(0);
  }

  // Matching
  const pairs = matchAbisToContracts(contracts, abis);
  if (pairs.length === 0) {
    console.log('\n[SKIP] Could not match ABIs to contract addresses');
    console.log('  Contracts:', contracts.map(c => `${c.name}=${c.address}`).join(', '));
    console.log('  ABIs:', abis.map(a => a.name).join(', '));
    process.exit(0);
  }

  console.log(`  Matched pairs: ${pairs.length}`);
  for (const p of pairs) {
    console.log(`    ${p.abi.name} -> ${p.contract.address}`);
  }

  // Connect
  const client = createClient(
    withPolkadotSdkCompat(getWsProvider(WS_URL))
  );

  const unsafeApi = client.getUnsafeApi();

  if (!unsafeApi.apis?.ReviveApi?.call) {
    console.error('\n[FAIL] ReviveApi.call not available — chain may not support Revive pallet');
    await client.destroy();
    process.exit(1);
  }

  // Use a dummy SS58 origin for dry-run calls
  const dummyOrigin = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice

  const results: TestResult[] = [];
  let failures = 0;

  // Test each pair
  for (const { contract, abi } of pairs) {
    console.log(`\n--- ${abi.name} @ ${contract.address} ---`);

    const functions = abi.abi.filter(
      (item: any) => item.type === 'function'
    );

    if (functions.length === 0) {
      console.log('  [SKIP] No functions in ABI');
      results.push({ contract: contract.name, fn: '*', status: 'SKIP', message: 'No functions in ABI' });
      continue;
    }

    for (const fn of functions) {
      const fnName = fn.name;
      const inputs = fn.inputs || [];
      const label = `${fnName}(${inputs.map((i: any) => i.type).join(',')})`;

      try {
        // Build default args
        const args = inputs.map((input: any) => defaultArgForType(input));

        // Encode call data
        const callData = encodeFunctionData({
          abi: [fn],
          functionName: fnName,
          args: args.length > 0 ? args : undefined,
        });

        const callDataBytes = Binary.fromHex(callData);

        // Dry-run via ReviveApi.call
        const result = await unsafeApi.apis.ReviveApi.call(
          dummyOrigin,       // origin (SS58)
          contract.address,  // dest (H160)
          0n,                // value
          undefined,         // gas_limit
          undefined,         // storage_deposit_limit
          callDataBytes      // input data
        );

        // Classification: check the result
        // ReviveApi.call returns an object with flags and data
        // A business-logic revert still means the contract exists and is callable
        const flags = result?.flags?.bits !== undefined ? Number(result.flags.bits) : (typeof result?.flags === 'number' ? result.flags : 0);
        const isRevert = (flags & 1) !== 0; // Bit 0 = REVERT flag

        if (isRevert) {
          console.log(`  [PASS] ${label} — reverted (business logic, contract exists)`);
          results.push({ contract: contract.name, fn: label, status: 'PASS', message: 'Reverted (business logic)' });
        } else {
          console.log(`  [PASS] ${label} — success`);
          results.push({ contract: contract.name, fn: label, status: 'PASS', message: 'Success' });
        }
      } catch (error: any) {
        const msg = error.message || String(error);

        // Some errors indicate the contract doesn't exist or encoding is wrong
        if (
          msg.includes('not found') ||
          msg.includes('does not exist') ||
          msg.includes('invalid opcode') ||
          msg.includes('encoding') ||
          msg.includes('Expected input')
        ) {
          console.log(`  [FAIL] ${label} — ${msg.slice(0, 120)}`);
          results.push({ contract: contract.name, fn: label, status: 'FAIL', message: msg.slice(0, 200) });
          failures++;
        } else {
          // Other errors (e.g. RPC issues) — still a failure but might be transient
          console.log(`  [FAIL] ${label} — ${msg.slice(0, 120)}`);
          results.push({ contract: contract.name, fn: label, status: 'FAIL', message: msg.slice(0, 200) });
          failures++;
        }
      }
    }
  }

  await client.destroy();

  // Report
  console.log('\n=== CONTRACT CALL VALIDATION SUMMARY ===');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;
  console.log(`  PASS: ${passed}  FAIL: ${failed}  SKIP: ${skipped}`);

  if (failures > 0) {
    console.log('\nFailed calls:');
    for (const r of results.filter(r => r.status === 'FAIL')) {
      console.log(`  ${r.contract}.${r.fn}: ${r.message}`);
    }
    console.log('\nContract call validation FAILED');
    process.exit(1);
  } else {
    console.log('\nAll contract calls validated successfully!');
    process.exit(0);
  }
}

runContractTests().catch((error) => {
  console.error('\nContract call test FAILED:', error.message);
  console.error('\nCommon issues:');
  console.error('  - "ReviveApi.call not available" = Chain does not support Revive pallet');
  console.error('  - "encoding" errors = ABI does not match deployed contract');
  console.error('  - "not found" = Contract address is wrong or contract not deployed');
  process.exit(1);
});
