// Base contract hook — readContract/writeContract via PAPI ReviveApi
// Domain hooks (useStaking, useNFT, etc.) wrap this with specific ABI + address
import { useState, useCallback, useMemo } from 'react';
import { encodeFunctionData, decodeFunctionResult } from 'viem';
import type { Abi, Hex } from 'viem';
import { Binary } from 'polkadot-api';
import { getPAPIClient, isAccountMapped, isPAPIClientReady } from '../lib/papi/client';
import { usePolkadotWallet } from '../contexts/WalletContext';

/**
 * The chain client, or an error a player can act on.
 *
 * `getPAPIClient()` throws "not initialized", which reads as a programming
 * mistake. Since the host migration, "there is no client" is a legitimate
 * runtime state rather than a bug: inside a host container that does not serve
 * the configured chain, `getHostProvider` yields nothing and the app runs on
 * fine without chain reads (game state lives in the Statement Store). Contract
 * calls are the one thing that genuinely cannot proceed, so they say so.
 */
function requireChain() {
  if (!isPAPIClientReady()) {
    throw new Error(
      'No chain connection. This host does not serve the configured chain, so ' +
        'on-chain actions are unavailable — game play is unaffected.',
    );
  }
  return getPAPIClient();
}

// Normalize H160 to lowercase with 0x prefix
function normalizeH160(address: string): string {
  const trimmed = address.trim();
  const hex = trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`;
  return hex.toLowerCase();
}

function isH160(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/i.test(address.trim());
}

// Convert any address to H160 — handles both SS58 and H160 input
const h160Cache = new Map<string, string>();

async function toH160(addressInput: string): Promise<string> {
  const trimmed = addressInput.trim();
  if (isH160(trimmed)) return normalizeH160(trimmed);

  const cached = h160Cache.get(trimmed);
  if (cached) return cached;

  const { api } = requireChain();
  const result = await api.apis.ReviveApi.address(trimmed);
  let h160: string;
  if (result && typeof result.asHex === 'function') {
    h160 = normalizeH160(result.asHex());
  } else if (typeof result === 'string') {
    h160 = normalizeH160(result);
  } else {
    h160 = normalizeH160(String(result));
  }
  h160Cache.set(trimmed, h160);
  return h160;
}

// Map Solidity revert reasons to user-friendly messages
const REVERT_MESSAGES: Record<string, string> = {
  'AccountUnmapped': 'Setting up your account. Please approve both transactions.',
  'Insufficient balance': 'Not enough PAS for this transaction.',
  'OutOfGas': 'Transaction ran out of gas. Please try again.',
  'ExhaustsResources': 'Transaction exceeds resource limits. Try a smaller operation.',
  'out of gas': 'Transaction ran out of gas. Please try again.',
};

function parseErrorMessage(err: any): string {
  const errorString = err.toString?.() || '';
  for (const [pattern, msg] of Object.entries(REVERT_MESSAGES)) {
    if (errorString.toLowerCase().includes(pattern.toLowerCase())) return msg;
  }
  if (err.message?.includes('cancelled') || err.message?.includes('rejected')) {
    return 'Transaction was cancelled in your wallet.';
  }
  return err.message || 'An unexpected error occurred.';
}

export function useContractPAPI(contractAbi: Abi, contractAddress: string) {
  const { address, h160Address, getSigner } = usePolkadotWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  /**
   * Read from contract via ReviveApi.call (no signing needed)
   */
  const readContract = useCallback(async (functionName: string, args: any[] = []): Promise<any> => {
    if (!address) throw new Error('Wallet not connected');

    const { api } = requireChain();
    const data = encodeFunctionData({ abi: contractAbi, functionName, args }) as Hex;

    const result = await api.apis.ReviveApi.call(
      address,
      Binary.fromHex(contractAddress as Hex),
      0n,
      undefined,
      undefined,
      Binary.fromHex(data),
      { at: 'best' },
    );

    const callResult = result.result;
    if (!callResult) throw new Error(`No result for ${functionName}`);

    // Handle success/failure format
    if ('success' in callResult) {
      if (!callResult.success) {
        const isAccountUnmapped = callResult.value?.value?.type === 'Revive' &&
          callResult.value?.value?.value?.type === 'AccountUnmapped';
        if (isAccountUnmapped) {
          return undefined;
        }
        throw new Error(`Contract read failed: ${JSON.stringify(callResult.value)}`);
      }
      const valueData = callResult.value?.data || callResult.value;
      let resultData: string;
      if (valueData && typeof valueData.asHex === 'function') {
        resultData = valueData.asHex();
      } else if (typeof valueData === 'string') {
        resultData = valueData.startsWith('0x') ? valueData : `0x${valueData}`;
      } else if (valueData && valueData.bytes) {
        resultData = '0x' + Array.from(valueData.bytes as Uint8Array)
          .map((b: number) => b.toString(16).padStart(2, '0')).join('');
      } else {
        throw new Error(`Cannot extract data for ${functionName}`);
      }
      return decodeFunctionResult({ abi: contractAbi, functionName, data: resultData as Hex });
    }

    // Type-based result format
    if (callResult.type === 'Reverted' || callResult.type === 'Error') {
      throw new Error(`Contract call ${callResult.type}`);
    }

    const responseData = callResult.data || callResult.value?.data || callResult;
    let resultData: string;
    if (responseData && typeof responseData.asHex === 'function') {
      resultData = responseData.asHex();
    } else if (typeof responseData === 'string') {
      resultData = responseData.startsWith('0x') ? responseData : `0x${responseData}`;
    } else {
      throw new Error(`Cannot extract data for ${functionName}`);
    }
    return decodeFunctionResult({ abi: contractAbi, functionName, data: resultData as Hex });
  }, [address, contractAbi, contractAddress]);

  /**
   * Write to contract via tx.Revive.call + auto account mapping
   */
  const writeContract = useCallback(async (
    functionName: string,
    args: any[] = [],
    value: bigint = 0n
  ): Promise<{ receipt: any; eventData?: any }> => {
    if (!address || !h160Address) throw new Error('Wallet not connected');
    const signer = getSigner();
    if (!signer) throw new Error('Signer not available');

    const { api } = requireChain();

    // Check account mapping BEFORE the transaction
    const needsMapping = !(await isAccountMapped(address));

    const data = encodeFunctionData({ abi: contractAbi, functionName, args }) as Hex;

    // Dry-run to estimate gas (avoids OutOfGas errors)
    let refTime = 50_000_000_000n;
    let proofSize = 2_000_000n;
    let storageDeposit = 10_000_000_000n;

    try {
      // IMPORTANT: ReviveApi.call origin expects AccountId32 (SS58), NOT H160
      const dryRun = await api.apis.ReviveApi.call(
        address,
        Binary.fromHex(contractAddress as Hex),
        value,
        undefined,
        undefined,
        Binary.fromHex(data),
        { at: 'best' },
      );

      if (dryRun?.gas_required) {
        refTime = BigInt(dryRun.gas_required.ref_time) * 5n / 4n;
        proofSize = BigInt(dryRun.gas_required.proof_size) * 5n / 4n;
        if (proofSize > 3_500_000n) proofSize = 3_500_000n;
      }
      if ((dryRun as any)?.storage_deposit?.Charge) {
        const estimated = BigInt((dryRun as any).storage_deposit.Charge) * 5n / 4n;
        storageDeposit = estimated > 10_000_000_000n ? estimated : 10_000_000_000n;
      }
    } catch {
      // Dry-run failed (e.g. account unmapped on first call) — use generous defaults
    }

    const contractCall = api.tx.Revive.call({
      dest: Binary.fromHex(contractAddress as Hex),
      value,
      weight_limit: { ref_time: refTime, proof_size: proofSize },
      storage_deposit_limit: storageDeposit,
      data: Binary.fromHex(data),
    });

    // If mapping needed, batch with Utility.batch_all (single user approval)
    let txToSubmit;
    let isBatch = false;
    if (needsMapping) {
      const calls = [
        api.tx.Revive.map_account().decodedCall,
        contractCall.decodedCall,
      ];
      txToSubmit = api.tx.Utility.batch_all({ calls });
      isBatch = true;
    } else {
      txToSubmit = contractCall;
    }

    // Sign and submit, resolve on block inclusion (~6s vs ~18s for finalized)
    const result = await new Promise<{ receipt: any; eventData?: any }>((resolve, reject) => {
      let isResolved = false;
      const subscription = txToSubmit.signSubmitAndWatch(signer).subscribe({
        next: (event: any) => {
          if (isResolved) return;
          if (event.type === 'txBestBlocksState' && event.found) {
            const failedEvent = event.events?.find(
              (e: any) => e.type === 'System' && e.value?.type === 'ExtrinsicFailed'
            );
            if (failedEvent) {
              isResolved = true;
              subscription.unsubscribe();
              reject(new Error(`Transaction failed: ${JSON.stringify(failedEvent.value?.value)}`));
              return;
            }
            if (isBatch) {
              const batchCompleted = event.events?.some(
                (e: any) => e.type === 'Utility' && e.value?.type === 'BatchCompleted'
              );
              if (!batchCompleted) {
                isResolved = true;
                subscription.unsubscribe();
                reject(new Error('Batch transaction did not complete'));
                return;
              }
            }
            const eventData: any = { logs: [] };
            event.events?.forEach((e: any) => {
              if (e.type === 'Revive') {
                eventData[e.value.type] = e.value;
                if (e.value.type === 'ContractEmitted' && e.value.value) {
                  eventData.logs.push(e.value.value);
                }
              }
            });
            isResolved = true;
            subscription.unsubscribe();
            resolve({ receipt: event, eventData });
          }
        },
        error: (err: any) => {
          if (isResolved) return;
          isResolved = true;
          reject(err);
        },
      });
    });

    return result;
  }, [address, h160Address, getSigner, contractAbi, contractAddress]);

  return useMemo(() => ({
    readContract,
    writeContract,
    toH160,
    isLoading,
    setIsLoading,
    error,
    setError,
    parseErrorMessage,
  }), [readContract, writeContract, isLoading, error]);
}
