// Types for the vendored Spotlight broadcast SDK (spotlight-broadcast.js).
// Mirrors the exports of spotlight-mesh src/sdk/index.ts.

export interface MediaOptions {
  video: HTMLCanvasElement | MediaStream
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

export interface LaunchScreenOptions extends MediaOptions, Omit<LiveOptions, 'title'> {
  title?: string
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
  error: { message: string; fatal: boolean }
  ended: void
}

export interface DeviceControls {
  readonly camera: boolean
  readonly microphone: boolean
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
/** localStorage key set while the launch screen asks for devices (holds Date.now()). */
export const LAUNCH_INTENT_KEY: 'spotlight-broadcast.launchIntent'
export function launchIntentPending(): boolean
/** The engine log as text (Spotlight debug-log format). The SDK logs to memory only. */
export function getBroadcastLog(): string
