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
  const AudioCtor: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return () => {};

  const ctx = new AudioCtor();
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
    void ctx.close().catch(() => {});
  };
}
