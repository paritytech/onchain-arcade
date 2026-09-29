// The 1-to-1 voice control for an active match.
//
// Deliberately one compact row rather than a panel: the board is what the
// player came for, and a call widget that competes with it for attention is a
// call widget people turn off. Everything is one tap — invite, accept, mute,
// hang up — and the only text that ever appears is a failure the player can
// act on.
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, MicOff, Phone, PhoneOff, PhoneIncoming, Loader2 } from 'lucide-react'

import { useVoice } from '@/contexts/VoiceContext'
import { cn } from '@/lib/cn'

/** Level at which we call someone "speaking". Above the noise floor of a
 *  typical laptop mic, below a normal speaking voice. */
const SPEAKING_THRESHOLD = 0.08

function LevelDot({ level, active }: { level: number; active: boolean }) {
  const speaking = active && level > SPEAKING_THRESHOLD
  return (
    <span
      className={cn(
        'inline-block w-2 h-2 rounded-full transition-colors',
        speaking ? 'bg-success' : active ? 'bg-grey-400' : 'bg-grey-600',
      )}
      style={speaking ? { transform: `scale(${1 + Math.min(level, 0.5)})` } : undefined}
      aria-hidden="true"
    />
  )
}

export function VoiceBar() {
  const {
    available, state, detail, muted, localLevel, remoteLevel,
    invite, accept, decline, hangUp, toggleMute,
  } = useVoice()

  // No opponent, or playing the computer — nothing to call.
  if (!available) return null

  const inCall = state === 'connected' || state === 'connecting'

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <AnimatePresence mode="wait" initial={false}>
        {state === 'ringing' ? (
          <motion.div
            key="ringing"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2"
          >
            <span className="flex items-center gap-2 text-body-sm text-text">
              <PhoneIncoming className="w-4 h-4 animate-pulse" aria-label="Incoming call" />
              Opponent wants to talk
            </span>
            <button
              onClick={accept}
              className="px-3 py-1.5 rounded-lg bg-success text-white text-body-sm font-medium min-h-[36px]"
            >
              Accept
            </button>
            <button
              onClick={decline}
              className="px-3 py-1.5 rounded-lg border border-border text-text text-body-sm min-h-[36px]"
            >
              Decline
            </button>
          </motion.div>
        ) : inCall ? (
          <motion.div
            key="incall"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-3"
          >
            <span className="flex items-center gap-2 text-body-sm text-grey-400">
              {state === 'connecting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-label="Connecting" />
                  Connecting…
                </>
              ) : (
                <>
                  <LevelDot level={localLevel} active={!muted} />
                  <LevelDot level={remoteLevel} active />
                  Voice on
                </>
              )}
            </span>

            <button
              onClick={toggleMute}
              disabled={state !== 'connected'}
              aria-pressed={muted}
              className={cn(
                'px-3 py-1.5 rounded-lg border text-body-sm min-h-[36px] flex items-center gap-1.5',
                muted
                  ? 'border-warning text-warning'
                  : 'border-border text-text',
              )}
            >
              {muted
                ? <MicOff className="w-4 h-4" aria-label="Unmute" />
                : <Mic className="w-4 h-4" aria-label="Mute" />}
              {muted ? 'Muted' : 'Mute'}
            </button>

            <button
              onClick={hangUp}
              className="px-3 py-1.5 rounded-lg bg-error text-white text-body-sm font-medium min-h-[36px] flex items-center gap-1.5"
            >
              <PhoneOff className="w-4 h-4" aria-label="Hang up" />
              End
            </button>
          </motion.div>
        ) : state === 'inviting' ? (
          <motion.div
            key="inviting"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-3"
          >
            <span className="flex items-center gap-2 text-body-sm text-grey-400">
              <Loader2 className="w-4 h-4 animate-spin" aria-label="Ringing" />
              Ringing…
            </span>
            <button
              onClick={hangUp}
              className="px-3 py-1.5 rounded-lg border border-border text-text text-body-sm min-h-[36px]"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="idle"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            onClick={invite}
            className="px-3 py-1.5 rounded-lg border border-border text-text text-body-sm min-h-[36px] flex items-center gap-1.5 hover:bg-grey-800/40 transition-colors"
          >
            <Phone className="w-4 h-4" aria-label="Start voice chat" />
            Talk
          </motion.button>
        )}
      </AnimatePresence>

      {/* A failure the player can act on — a blocked mic, a call that would not
          connect. Shown inline rather than only as a toast, because the toast
          is gone by the time they look for the reason the button did nothing. */}
      {(state === 'failed' || state === 'declined') && detail && (
        <span className="text-caption text-error">{detail}</span>
      )}
    </div>
  )
}
