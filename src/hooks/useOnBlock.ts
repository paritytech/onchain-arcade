// useOnBlock — fires callback on each new best block (~2s on Asset Hub)
// Replaces setInterval-based polling with event-driven updates.
import { useEffect, useRef } from 'react';
import { getPAPIClient } from '../lib/papi/client';

/**
 * Runs `callback` whenever a new best block arrives.
 *
 * @param callback - function to run on each new block
 * @param options.enabled - set false to pause (default true)
 * @param options.minIntervalMs - throttle: skip blocks arriving faster than this (default 0).
 *   Use 6000+ for expensive RPC calls to avoid overwhelming the node.
 */
export function useOnBlock(
  callback: (blockNumber: number) => void,
  options: { enabled?: boolean; minIntervalMs?: number } = {}
) {
  const { enabled = true, minIntervalMs = 0 } = options;
  const lastRunRef = useRef(0);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const { client } = getPAPIClient();
    const subscription = client.bestBlocks$.subscribe((blocks) => {
      const now = Date.now();
      if (now - lastRunRef.current < minIntervalMs) return; // throttle
      lastRunRef.current = now;
      const latest = blocks[blocks.length - 1];
      callbackRef.current(latest?.number ?? 0);
    });

    return () => subscription.unsubscribe();
  }, [enabled, minIntervalMs]);
}
