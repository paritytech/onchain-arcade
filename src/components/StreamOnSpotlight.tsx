// "Stream on Spotlight": broadcasts the match area to Spotlight viewers.
//
// The match is rendered as HTML/SVG; the SDK paints the element into the
// stream itself. The click opens the SDK's launch screen: a preview of the
// board with the streamer's camera in the corner, a title, and Go live. The
// live controls are this header's, not the SDK's bar. The SDK loads on the
// first click only. Hidden outside a Polkadot host:
// the SDK signs through the host's Statement Store with this app's account.
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Radio, Square, Copy, Loader2, FileText, Video, VideoOff, Mic, MicOff } from 'lucide-react'

import { useNotifications } from '@/contexts/NotificationProvider'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { cn } from '@/lib/cn'
import { isInTriangleHost } from '@/lib/triangle/hostDetection'
import type { Broadcast } from '@/lib/spotlight/spotlight-broadcast'

type Sdk = typeof import('@/lib/spotlight/spotlight-broadcast')

const TAP = 'min-h-[44px] min-w-[44px]'
const pill =
  'px-3 py-2 rounded-lg border border-border text-body-sm text-text ' +
  'flex items-center gap-1.5 transition-colors hover:bg-grey-800/40 ' + TAP

/** Where viewers watch. Unset = production Spotlight beside this app on the
 *  same web shell (the SDK derives it). */
const SPOTLIGHT_ORIGIN = (import.meta.env.VITE_SPOTLIGHT_ORIGIN as string | undefined) || undefined

/** LAUNCH_INTENT_KEY in the SDK. Read here so a reload can reopen the launch
 *  screen without loading the SDK first. */
const LAUNCH_INTENT_KEY = 'spotlight-broadcast.launchIntent'
const LAUNCH_INTENT_TTL_MS = 2 * 60_000

/** The host reloads this frame the first time it grants the camera or mic.
 *  The launch screen leaves this key behind when that happens. */
function launchIntentPending(): boolean {
  try {
    const at = Number(localStorage.getItem(LAUNCH_INTENT_KEY))
    return at > 0 && Date.now() - at < LAUNCH_INTENT_TTL_MS
  } catch {
    return false
  }
}

type State =
  | { phase: 'idle' }
  | { phase: 'launching' }
  | { phase: 'live'; live: Broadcast; viewers: number; camera: boolean; microphone: boolean }

export function StreamOnSpotlight({ target, title }: { target: RefObject<HTMLElement>; title: string }) {
  const { addNotification } = useNotifications()
  /** The streamer's name on Spotlight's lobby card and in chat. Without it
   *  Spotlight shows this app's dotNS name. */
  const { displayName } = usePolkadotWallet()
  const [state, setState] = useState<State>({ phase: 'idle' })
  const liveRef = useRef<Broadcast | null>(null)
  /** A device this frame never held may make the host reload the app, which
   *  ends the stream: the first click warns, a second within 6 s asks. */
  const armed = useRef({ camera: 0, microphone: 0 })
  /** Loaded on the first click. Its log is the only record of why a stream
   *  failed, so the copy-log control shows from then on. */
  const [sdk, setSdk] = useState<Sdk | null>(null)

  // Leaving the match page ends the stream.
  useEffect(
    () => () => {
      void liveRef.current?.end()
    },
    [],
  )

  // Back from a permission reload with the launch screen open: open it again.
  // The grant is remembered now, so this time it does not reload.
  const resumed = useRef(false)
  useEffect(() => {
    if (resumed.current || !isInTriangleHost() || !launchIntentPending()) return
    resumed.current = true
    void launch()
  }, []) // once, on mount

  if (!isInTriangleHost()) return null

  async function launch() {
    const el = target.current
    if (!el) return
    setState({ phase: 'launching' })
    try {
      const loaded = await import('@/lib/spotlight/spotlight-broadcast.js')
      setSdk(loaded)
      const live = await loaded.openLaunchScreen({
        video: el,
        title,
        hostName: displayName ?? undefined,
        spotlightOrigin: SPOTLIGHT_ORIGIN,
        controls: false,
      })
      if (!live) {
        setState({ phase: 'idle' })
        return
      }
      liveRef.current = live
      live.on('viewers', (viewers) =>
        setState((s) => (s.phase === 'live' ? { ...s, viewers } : s)),
      )
      live.on('error', ({ message, fatal }) => addNotification(fatal ? 'error' : 'warning', message))
      live.on('ended', () => {
        liveRef.current = null
        setState({ phase: 'idle' })
      })
      setState({ phase: 'live', live, viewers: 0, camera: live.camera, microphone: live.microphone })
      if (live.roomUrl) await copyLink(live.roomUrl)
    } catch (err) {
      setState({ phase: 'idle' })
      addNotification('error', `Could not go live: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      addNotification('success', 'Live on Spotlight. Viewer link copied.')
    } catch {
      addNotification('info', `Live on Spotlight: ${url}`)
    }
  }

  const copyLog = async () => {
    if (!sdk) return
    try {
      await navigator.clipboard.writeText(sdk.getBroadcastLog())
      addNotification('success', 'Stream log copied.')
    } catch {
      addNotification('error', 'Could not copy the stream log.')
    }
  }
  const logButton = sdk && (
    <button className={pill} onClick={() => void copyLog()} aria-label="Copy stream log">
      <FileText className="w-4 h-4" />
    </button>
  )

  const toggle = async (live: Broadcast, device: 'camera' | 'microphone') => {
    const turningOn = device === 'camera' ? !live.camera : !live.microphone
    if (turningOn && live.asksHost(device) && Date.now() - armed.current[device] > 6_000) {
      armed.current[device] = Date.now()
      addNotification('warning', `Polkadot may reload the app to allow the ${device}, which ends the stream. Click again to ask anyway.`)
      return
    }
    armed.current[device] = 0
    try {
      if (device === 'camera') await live.setCamera(!live.camera)
      else await live.setMicrophone(!live.microphone)
    } catch {
      addNotification('error', `Polkadot did not allow the ${device}.`)
    }
    setState((s) => (s.phase === 'live' ? { ...s, camera: live.camera, microphone: live.microphone } : s))
  }

  if (state.phase === 'live') {
    const { live, viewers, camera, microphone } = state
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-body-sm text-error font-semibold" aria-live="polite">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" aria-hidden />
          LIVE · {viewers} {viewers === 1 ? 'viewer' : 'viewers'}
        </span>
        <button
          className={pill}
          onClick={() => void toggle(live, 'camera')}
          aria-label={camera ? 'Turn camera off' : 'Turn camera on'}
          aria-pressed={camera}
        >
          {camera ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </button>
        <button
          className={pill}
          onClick={() => void toggle(live, 'microphone')}
          aria-label={microphone ? 'Mute microphone' : 'Unmute microphone'}
          aria-pressed={microphone}
        >
          {microphone ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>
        {live.roomUrl && (
          <button className={pill} onClick={() => void copyLink(live.roomUrl!)} aria-label="Copy viewer link">
            <Copy className="w-4 h-4" />
          </button>
        )}
        <button className={pill} onClick={() => void live.end()} aria-label="End stream">
          <Square className="w-4 h-4" /> End
        </button>
        {logButton}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className={cn(pill, state.phase === 'launching' && 'opacity-70')}
        onClick={() => void launch()}
        disabled={state.phase === 'launching'}
      >
        {state.phase === 'launching' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
        {state.phase === 'launching' ? 'Setting up…' : 'Stream on Spotlight'}
      </button>
      {logButton}
    </div>
  )
}
