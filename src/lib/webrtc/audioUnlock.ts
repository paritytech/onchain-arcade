// One shared AudioContext for the page, unlocked on a user gesture.
//
// Browsers start an AudioContext SUSPENDED unless it is created (or resumed)
// during a user gesture, and a suspended context's AnalyserNode reads silence
// forever. The first version of the voice feature built its context inside
// meterStream(), which runs after `await getUserMedia` — outside the gesture's
// synchronous window — so the speaking indicator was dead on arrival with no
// error anywhere. Same class of failure as the `<audio>` autoplay trap below.
//
// Evidence: an AudioContext created outside a gesture throws "The AudioContext
// was not allowed to start. It must be resumed (or created) after a user
// gesture on the page." Media elements fed a MediaStream via srcObject are
// currently exempt from autoplay blocking in Chrome, but that is explicitly
// documented as subject to change, so we call play() and handle the rejection
// rather than relying on `autoplay` alone.
// https://developer.chrome.com/blog/autoplay
// https://webrtchacks.com/autoplay-restrictions-and-webrtc/

let ctx: AudioContext | null = null

function AudioCtor(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') return undefined
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  )
}

/**
 * Create or resume the shared AudioContext. MUST be called synchronously from
 * a click handler — after the first `await` the gesture no longer counts.
 * Safe to call repeatedly.
 */
export function unlockAudio(): AudioContext | null {
  const Ctor = AudioCtor()
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  if (ctx.state === 'suspended') {
    // Fire-and-forget: resume() rejects when there is no gesture, and the next
    // gesture will try again. Throwing here would abort a call for a cosmetic
    // level meter.
    void ctx.resume().catch(() => {})
  }
  return ctx
}

/** The shared context, if it has been unlocked. Never creates one — a context
 *  created outside a gesture is born suspended and stays that way. */
export function audioContext(): AudioContext | null {
  return ctx
}

/**
 * Start playback on an element fed by a MediaStream, reporting the one failure
 * that matters: autoplay refused. The caller surfaces that as "tap to hear your
 * opponent" rather than leaving a silent, healthy-looking connection.
 */
export async function playRemote(el: HTMLMediaElement): Promise<'ok' | 'blocked'> {
  try {
    await el.play()
    return 'ok'
  } catch (err) {
    if ((err as DOMException)?.name === 'NotAllowedError') return 'blocked'
    return 'blocked'
  }
}
