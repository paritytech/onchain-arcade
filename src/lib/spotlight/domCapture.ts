// Paints a DOM subtree into a fixed-size canvas, for streaming a board that
// is rendered as HTML/SVG rather than on a canvas.
//
// The boards are turn-based, so this re-snapshots only when the subtree
// changes (MutationObserver), at most every SNAPSHOT_MS, plus a slow refresh
// that picks up CSS animations a mutation does not announce. The output canvas
// keeps its last frame between snapshots, so the stream never goes blank.
import { getFontEmbedCSS, toCanvas } from 'html-to-image'

const SNAPSHOT_MS = 250
const REFRESH_MS = 2_000

export interface DomCapture {
  canvas: HTMLCanvasElement
  stop: () => void
}

export function captureElement(el: HTMLElement, width = 1280, height = 720): DomCapture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const background = getComputedStyle(document.body).backgroundColor || '#000'

  let dirty = true
  let busy = false
  let lastAt = 0
  let stopped = false
  // Font CSS is fetched and inlined once, not on every snapshot.
  const fontCss = getFontEmbedCSS(el).catch(() => '')

  const snapshot = async () => {
    busy = true
    dirty = false
    lastAt = Date.now()
    try {
      const frame = await toCanvas(el, {
        backgroundColor: background,
        pixelRatio: 1,
        fontEmbedCSS: await fontCss,
        // The clone keeps the element's own margin (e.g. from a parent's
        // space-y-*) but not the room for it, which cuts off the bottom.
        style: { margin: '0' },
      })
      if (stopped || frame.width === 0 || frame.height === 0) return
      const scale = Math.min(width / frame.width, height / frame.height)
      const w = frame.width * scale
      const h = frame.height * scale
      ctx.fillStyle = background
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(frame, (width - w) / 2, (height - h) / 2, w, h)
    } catch (err) {
      console.warn('[spotlight] board snapshot failed', err)
    } finally {
      busy = false
    }
  }

  const observer = new MutationObserver(() => {
    dirty = true
  })
  observer.observe(el, { subtree: true, childList: true, attributes: true, characterData: true })

  const timer = setInterval(() => {
    if (busy) return
    if (dirty || Date.now() - lastAt >= REFRESH_MS) void snapshot()
  }, SNAPSHOT_MS)

  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)
  void snapshot()

  return {
    canvas,
    stop: () => {
      stopped = true
      clearInterval(timer)
      observer.disconnect()
    },
  }
}
