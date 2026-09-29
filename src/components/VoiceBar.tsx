// The 1-to-1 voice control for an active match.
//
// Shape follows the research rather than instinct:
//  - The control RECEDES; the speaking state attaches to the person. Roblox
//    developers complain their mic bubble "appears always above the character
//    regardless of whether the user intends to use it" — so this is one pill,
//    not a panel, and the level rings live on the player cards.
//  - Nothing touches getUserMedia until the primer is answered. A permission
//    prompt with no stated reason is granted ~12% of the time; one that follows
//    an interaction ~30%, and an explicit reason raises it further.
//  - A denied microphone gets recovery instructions, never another prompt —
//    re-calling getUserMedia when the state is 'denied' shows nothing at all.
//  - Mute-opponent and block are present from v1. Report is not: there is no
//    moderation backend, and a report button that goes nowhere implies a review
//    that will never happen.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Mic, MicOff, Phone, PhoneOff, PhoneIncoming, Loader2,
  Volume2, VolumeX, ShieldBan, AlertTriangle,
} from 'lucide-react'

import { useVoice } from '@/contexts/VoiceContext'
import { cn } from '@/lib/cn'

/** Minimum touch target. WCAG 2.2 SC 2.5.8 asks 24px; Apple HIG 44pt and
 *  Material 48dp are the practical floors for a thumb. */
const TAP = 'min-h-[44px] min-w-[44px]'

const pill =
  'px-3 py-2 rounded-lg border border-border text-body-sm text-text ' +
  'flex items-center gap-1.5 transition-colors hover:bg-grey-800/40 ' + TAP

export function VoiceBar() {
  const v = useVoice()
  const reduceMotion = useReducedMotion()

  if (!v.available) return null

  const anim = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 } }

  // A permanently-denied mic cannot be re-prompted. Name the fix instead.
  if (v.micPermission === 'denied') {
    return (
      <div className="flex items-center gap-2 text-caption text-warning max-w-xs">
        <AlertTriangle className="w-4 h-4 shrink-0" aria-label="Microphone blocked" />
        <span>
          Microphone blocked. Allow it in your browser’s site settings, then reload.
        </span>
      </div>
    )
  }

  const inCall = v.state === 'connected' || v.state === 'connecting'

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* Autoplay refused: this tap is the gesture that starts playback. */}
      {v.remoteBlocked && (
        <button onClick={v.resumeRemote} className={cn(pill, 'border-warning text-warning')}>
          <Volume2 className="w-4 h-4" aria-label="Enable sound" />
          Tap to hear
        </button>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {v.priming ? (
          <motion.div
            key="primer" {...anim}
            className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-surface max-w-xs text-left"
          >
            <p className="text-body-sm text-text">
              Talk to your opponent while you play. Only they can hear you, and
              the call ends with the match.
            </p>
            <div className="flex gap-2">
              <button
                onClick={v.confirmEnable}
                className={cn('px-3 py-2 rounded-lg bg-accent text-white text-body-sm font-medium', TAP)}
              >
                Enable microphone
              </button>
              <button onClick={v.cancelPriming} className={pill}>Not now</button>
            </div>
          </motion.div>
        ) : v.state === 'ringing' ? (
          <motion.div key="ringing" {...anim} className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-body-sm text-text">
              <PhoneIncoming className="w-4 h-4" aria-label="Incoming call" />
              Wants to talk
            </span>
            <button
              onClick={v.accept}
              className={cn('px-3 py-2 rounded-lg bg-success text-white text-body-sm font-medium', TAP)}
            >
              Accept
            </button>
            <button onClick={v.decline} className={pill}>Decline</button>
          </motion.div>
        ) : inCall ? (
          <motion.div key="incall" {...anim} className="flex items-center gap-2">
            {v.state === 'connecting' && (
              <span className="flex items-center gap-1.5 text-body-sm text-grey-400">
                <Loader2 className={cn('w-4 h-4', !reduceMotion && 'animate-spin')} aria-label="Connecting" />
                Connecting…
              </span>
            )}

            <button
              onClick={v.toggleMute}
              disabled={v.state !== 'connected'}
              aria-pressed={v.muted}
              className={cn(pill, v.muted && 'border-warning text-warning')}
            >
              {v.muted
                ? <MicOff className="w-4 h-4" aria-label="Unmute yourself" />
                : <Mic className="w-4 h-4" aria-label="Mute yourself" />}
              <span className="hidden sm:inline">{v.muted ? 'Muted' : 'Mute'}</span>
            </button>

            {/* Silence them for us only. They are not told. */}
            <button
              onClick={v.togglePeerMute}
              aria-pressed={v.peerMuted}
              className={cn(pill, v.peerMuted && 'border-warning text-warning')}
            >
              {v.peerMuted
                ? <VolumeX className="w-4 h-4" aria-label="Unmute opponent" />
                : <Volume2 className="w-4 h-4" aria-label="Mute opponent" />}
            </button>

            <button
              onClick={v.blockPeer}
              className={cn(pill, 'border-error/40 text-error')}
              title="Block this player from calling you again"
            >
              <ShieldBan className="w-4 h-4" aria-label="Block this player" />
            </button>

            <button
              onClick={v.hangUp}
              className={cn('px-3 py-2 rounded-lg bg-error text-white text-body-sm font-medium flex items-center gap-1.5', TAP)}
            >
              <PhoneOff className="w-4 h-4" aria-label="End call" />
              <span className="hidden sm:inline">End</span>
            </button>
          </motion.div>
        ) : v.state === 'inviting' ? (
          <motion.div key="inviting" {...anim} className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-body-sm text-grey-400">
              <Loader2 className={cn('w-4 h-4', !reduceMotion && 'animate-spin')} aria-label="Ringing" />
              Ringing…
            </span>
            <button onClick={v.hangUp} className={pill}>Cancel</button>
          </motion.div>
        ) : (
          <motion.button key="idle" {...anim} onClick={v.startVoice} className={pill}>
            <Phone className="w-4 h-4" aria-label="Start voice chat" />
            <span className="hidden sm:inline">Talk</span>
          </motion.button>
        )}
      </AnimatePresence>

      {(v.state === 'failed' || v.state === 'declined') && v.detail && (
        <span className="text-caption text-error w-full text-right">{v.detail}</span>
      )}
    </div>
  )
}
