// Types for the vendored Spotlight broadcast SDK (spotlight-broadcast.js).
// Mirrors the exports of spotlight-mesh src/sdk/broadcast.ts.

export interface StartBroadcastOptions {
  video: HTMLCanvasElement | MediaStream
  audio?: MediaStream | MediaStreamTrack | null
  title: string
  hostName?: string
  fps?: number
  spotlightOrigin?: string
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

export interface Broadcast {
  readonly roomHash: string
  readonly roomUrl: string | null
  readonly hostAddress: string
  on<K extends keyof BroadcastEvents>(event: K, handler: (data: BroadcastEvents[K]) => void): () => void
  sendChat(text: string): void
  end(): Promise<void>
}

export function startBroadcast(opts: StartBroadcastOptions): Promise<Broadcast>

/** The engine log as text (Spotlight debug-log format). The SDK logs to memory only. */
export function getBroadcastLog(): string
