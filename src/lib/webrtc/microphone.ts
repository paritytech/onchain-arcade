// Microphone capture, with the host-container detour that makes it work at all
// inside Polkadot Desktop.
//
// The webview's Electron session routes EVERY getUserMedia call as a single
// 'media' permission, which the host maps to `Camera`. The microphone
// therefore never gets its OS-level prompt (macOS TCC), and
// `getUserMedia({ audio: true })` rejects even after the user has approved the
// host's own dialog. Asking the host for the named `Microphone` permission
// first runs its full allow/deny + `systemPreferences.askForMediaAccess` flow,
// so the OS prompt is already resolved by the time getUserMedia runs.
//
// Outside a host container this is a no-op and the browser's own permission
// prompt is the only gate.

import { requestDevicePermission } from '@parity/product-sdk/host';

import { isInTriangleHost } from '../triangle/hostDetection';
import { audioContext } from './audioUnlock';

/** The host refused the microphone, so there is nothing to capture. */
export class MicrophonePermissionError extends Error {
  constructor(public readonly reason: 'host-denied' | 'browser-denied' | 'no-device') {
    super(
      reason === 'host-denied'
        ? 'The Polkadot host denied microphone access.'
        : reason === 'no-device'
          ? 'No microphone was found on this device.'
          : 'Microphone access was denied by the browser.',
    );
    this.name = 'MicrophonePermissionError';
  }
}

/**
 * Ask the host for the `Microphone` permission. Returns true outside a host
 * container, where there is nothing to ask.
 */
async function ensureHostMicrophonePermission(): Promise<boolean> {
  if (!isInTriangleHost()) return true;
  try {
    const result = await requestDevicePermission('Microphone');
    if (!result.ok) {
      console.warn('[Voice] Host device-permission request failed:', result.error);
      return false;
    }
    return result.value === true;
  } catch (err) {
    console.warn('[Voice] Host device-permission request threw:', err);
    return false;
  }
}

/**
 * Capture the microphone for a voice call.
 *
 * Echo cancellation, noise suppression and auto gain are all on: two players
 * on laptop speakers without them produce a feedback loop within seconds.
 */
export async function requestMicrophone(): Promise<MediaStream> {
  if (!(await ensureHostMicrophonePermission())) {
    throw new MicrophonePermissionError('host-denied');
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new MicrophonePermissionError('no-device');
  }

  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false,
    });
  } catch (err) {
    const e = err as DOMException;
    if (e.name === 'NotAllowedError' || e.name === 'SecurityError') {
      throw new MicrophonePermissionError('browser-denied');
    }
    if (e.name === 'NotFoundError' || e.name === 'OverconstrainedError') {
      throw new MicrophonePermissionError('no-device');
    }
    throw err;
  }
}

/**
 * What the browser currently thinks about microphone access.
 *
 * `denied` is the state worth detecting: re-calling getUserMedia there does NOT
 * re-show the system prompt, so a "Talk" button that keeps failing silently is
 * the worst outcome. The UI replaces it with recovery instructions instead.
 * `navigator.permissions` is absent or lacks the microphone name in some
 * browsers (notably older Safari), which reports as 'unknown'.
 */
export type MicPermission = 'granted' | 'denied' | 'prompt' | 'unknown';

export async function micPermissionState(): Promise<MicPermission> {
  const status = await queryMicPermission();
  return status ? readState(status) : 'unknown';
}

/**
 * Follow the mic permission live. A one-shot read left the "blocked" notice up
 * after the player re-enabled the mic in site settings — the Talk button never
 * came back. Returns an unsubscribe.
 */
export function watchMicPermission(onChange: (state: MicPermission) => void): () => void {
  let stopped = false;
  let status: PermissionStatus | null = null;
  const handler = () => { if (status && !stopped) onChange(readState(status)); };
  void queryMicPermission().then((s) => {
    if (stopped) return;
    if (!s) { onChange('unknown'); return; }
    status = s;
    s.addEventListener('change', handler);
    handler();
  });
  return () => {
    stopped = true;
    status?.removeEventListener('change', handler);
  };
}

async function queryMicPermission(): Promise<PermissionStatus | null> {
  try {
    const perms = navigator.permissions;
    if (!perms?.query) return null;
    return await perms.query({ name: 'microphone' as PermissionName });
  } catch {
    return null;
  }
}

/**
 * Inside a host container the page is framed, and `denied` there reflects the
 * frame's permission policy, not a choice the player made — the host mediates
 * the mic through requestDevicePermission. Reporting it as 'denied' hid the
 * Talk button for good. Let the host flow decide; a real refusal still
 * surfaces as a failed call.
 */
function readState(status: PermissionStatus): MicPermission {
  const state = status.state as MicPermission;
  return state === 'denied' && isInTriangleHost() ? 'unknown' : state;
}

/** Stop every track on a stream. Forgetting this leaves the OS mic indicator
 *  lit after a call ends, which players reasonably read as being recorded. */
export function stopStream(stream: MediaStream | null): void {
  if (!stream) return;
  for (const track of stream.getTracks()) track.stop();
}

/**
 * Peak level of a stream, 0..1, sampled from an AnalyserNode.
 *
 * Returns a stop function. Used for the speaking indicator: without one, a
 * muted-at-the-OS-level microphone is indistinguishable from a silent player,
 * and people spend a minute talking to nobody.
 */
export function meterStream(
  stream: MediaStream,
  onLevel: (level: number) => void,
): () => void {
  // The SHARED context, unlocked on the click that started the call. Building
  // one here instead would create it after `await getUserMedia` — outside the
  // gesture window — where it is born suspended and its analyser reads silence
  // forever, with no error to show for it.
  const ctx = audioContext();
  if (!ctx) return () => {};

  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.6;
  source.connect(analyser);

  const buf = new Uint8Array(analyser.frequencyBinCount);
  let raf = 0;
  let stopped = false;

  const tick = () => {
    if (stopped) return;
    analyser.getByteTimeDomainData(buf);
    // Peak deviation from the 128 midpoint, normalised.
    let peak = 0;
    for (let i = 0; i < buf.length; i++) {
      const d = Math.abs(buf[i] - 128);
      if (d > peak) peak = d;
    }
    onLevel(Math.min(1, peak / 128));
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    source.disconnect();
    // Deliberately NOT ctx.close(): the context is shared and closing it here
    // would silently break every later call's meter.
  };
}
