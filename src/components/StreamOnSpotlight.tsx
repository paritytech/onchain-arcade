// "Stream on Spotlight": broadcasts the match area to Spotlight viewers.
//
// The match is rendered as HTML/SVG, so `captureElement` paints it into a
// canvas and the Spotlight SDK streams that canvas. The SDK and the capture
// load on the first click only. Hidden outside a Polkadot host: the SDK signs
// through the host's Statement Store with this app's product account.
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Radio, Square, Copy, Loader2, FileText } from 'lucide-react'

import { useNotifications } from '@/contexts/NotificationProvider'
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

type State =
  | { phase: 'idle' }
  | { phase: 'starting' }
  | { phase: 'live'; live: Broadcast; viewers: number }

export function StreamOnSpotlight({ target, title }: { target: RefObject<HTMLElement>; title: string }) {
  const { addNotification } = useNotifications()
  const [state, setState] = useState<State>({ phase: 'idle' })
  const stopCapture = useRef<(() => void) | null>(null)
  const liveRef = useRef<Broadcast | null>(null)
  /** Loaded on the first click. Its log is the only record of why a stream
   *  failed, so the copy-log control shows from then on. */
  const [sdk, setSdk] = useState<Sdk | null>(null)

  // Leaving the match page ends the stream.
  useEffect(
    () => () => {
      void liveRef.current?.end()
      stopCapture.current?.()
    },
    [],
  )

  if (!isInTriangleHost()) return null

  const start = async () => {
    const el = target.current
    if (!el) return
    setState({ phase: 'starting' })
    let capture: { canvas: HTMLCanvasElement; stop: () => void } | null = null
    try {
      const [loaded, { captureElement }] = await Promise.all([
        import('@/lib/spotlight/spotlight-broadcast.js'),
        import('@/lib/spotlight/domCapture'),
      ])
      setSdk(loaded)
      capture = captureElement(el)
      const live = await loaded.startBroadcast({ video: capture.canvas, title, spotlightOrigin: SPOTLIGHT_ORIGIN })
      liveRef.current = live
      stopCapture.current = capture.stop
      live.on('viewers', (viewers) =>
        setState((s) => (s.phase === 'live' ? { ...s, viewers } : s)),
      )
      live.on('error', ({ message, fatal }) => addNotification(fatal ? 'error' : 'warning', message))
      live.on('ended', () => {
        stopCapture.current?.()
        stopCapture.current = null
        liveRef.current = null
        setState({ phase: 'idle' })
      })
      setState({ phase: 'live', live, viewers: 0 })
      if (live.roomUrl) await copyLink(live.roomUrl)
    } catch (err) {
      capture?.stop()
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

  if (state.phase === 'live') {
    const { live, viewers } = state
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-body-sm text-error font-semibold" aria-live="polite">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" aria-hidden />
          LIVE · {viewers} {viewers === 1 ? 'viewer' : 'viewers'}
        </span>
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
        className={cn(pill, state.phase === 'starting' && 'opacity-70')}
        onClick={() => void start()}
        disabled={state.phase === 'starting'}
      >
        {state.phase === 'starting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
        {state.phase === 'starting' ? 'Going live…' : 'Stream on Spotlight'}
      </button>
      {logButton}
    </div>
  )
}
