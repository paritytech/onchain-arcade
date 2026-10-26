// Types for the vendored Spotlight broadcast SDK (spotlight-broadcast.js).
// Mirrors the exports of spotlight-mesh src/sdk/index.ts.

export interface MediaOptions {
  /** A non-canvas element is painted into the stream (captureElement). */
  video: HTMLCanvasElement | HTMLElement | MediaStream
  audio?: MediaStream | MediaStreamTrack | null
  fps?: number
}

export interface PrepareOptions extends MediaOptions {
  camera?: boolean
  microphone?: boolean
}

export interface LiveOptions {
  title: string
  hostName?: string
  spotlightOrigin?: string
}

export interface StartBroadcastOptions extends MediaOptions, LiveOptions {}

export interface ControlBarOptions {
  /** Render inside this element. By default the bar floats at the bottom right. */
  container?: HTMLElement
}

export interface LaunchScreenOptions extends MediaOptions, Omit<LiveOptions, 'title'> {
  title?: string
  /** The SDK's on-air bar once live. Default on; false when the app has its own. */
  controls?: boolean | ControlBarOptions
  /** Aborting closes the screen (or ends the stream if it is going live). */
  signal?: AbortSignal
}

export interface AttachOptions extends LaunchScreenOptions {
  onLive?: (live: Broadcast) => void
}

export interface ElementCapture {
  readonly canvas: HTMLCanvasElement
  /** Rejects if the first snapshot fails (e.g. a cross-origin image without CORS). */
  readonly ready: Promise<void>
  onError: ((err: Error) => void) | null
  stop(): void
}

export interface ChatMessage {
  from: string
  senderName: string
  text: string
  timestamp: number
}

export interface BroadcastEvents {
  viewers: number
  chat: ChatMessage
  reaction: { from: string; emoji: string }
  /** fatal = the stream has ended; `ended` follows. */
  error: { message: string; fatal: boolean }
  ended: void
}

export interface DeviceControls {
  readonly camera: boolean
  readonly microphone: boolean
  /** Turning on a device this frame never held asks the host; on dot.li that may reload the frame. */
  asksHost(device: 'camera' | 'microphone'): boolean
  setCamera(on: boolean): Promise<void>
  setMicrophone(on: boolean): Promise<void>
}

export interface BroadcastPreview extends DeviceControls {
  readonly stream: MediaStream
  readonly refused: { camera: boolean; microphone: boolean }
  goLive(opts: LiveOptions): Promise<Broadcast>
  cancel(): void
}

export interface Broadcast extends DeviceControls {
  readonly roomHash: string
  readonly roomUrl: string | null
  readonly hostAddress: string
  on<K extends keyof BroadcastEvents>(event: K, handler: (data: BroadcastEvents[K]) => void): () => void
  sendChat(text: string): void
  end(): Promise<void>
}

export function prepareBroadcast(opts: PrepareOptions): Promise<BroadcastPreview>
export function startBroadcast(opts: StartBroadcastOptions): Promise<Broadcast>
/** Modal with preview, title, camera/mic toggles and Go live. Null on Cancel. */
export function openLaunchScreen(opts: LaunchScreenOptions): Promise<Broadcast | null>
/** Wires `button` to the launch screen and reopens it after a permission reload. Returns detach. */
export function attachLaunchScreen(button: HTMLButtonElement, opts: AttachOptions | (() => AttachOptions)): () => void
/** The on-air bar for a live stream. Returns a function that removes it. */
export function mountControlBar(live: Broadcast, opts?: ControlBarOptions): () => void
/** Paints a DOM subtree into a canvas (snapshots on change; for boards, not fast animation). */
export function captureElement(el: HTMLElement, width?: number, height?: number): ElementCapture
/** localStorage key set while the launch screen asks for devices (holds Date.now()). */
export const LAUNCH_INTENT_KEY: 'spotlight-broadcast.launchIntent'
export function launchIntentPending(): boolean
/** The engine log as text (Spotlight debug-log format). The SDK logs to memory only. */
export function getBroadcastLog(): string
