/**
 * Voice-call signalling statements.
 *
 * These ride the SAME Statement Store topic as game moves, because the two
 * players in a match are exactly the two parties to the call and the transport
 * already reaches both of them. They are NOT `GameStatement`s: the game state
 * is derived by replaying the statement log, and a phone call is not part of a
 * game's history. `statementStore` branches them off before the log — see
 * `onVoiceSignal` there.
 *
 * ## The handshake, and why it is three statements
 *
 * The SDP has to be sealed to the recipient's ephemeral X25519 key (see
 * ../lib/voice/sdpSeal.ts for why), which means the sealer needs that key
 * before it can seal. That is a chicken-and-egg with a single offer/answer
 * pair, so the invite carries the first key and doubles as the ring:
 *
 *   A -> voice_invite  { boxPub: A_pub }              "want to talk?"
 *   B -> voice_offer   { boxPub: B_pub, sealed(A) }   B accepts, B offers
 *   A -> voice_answer  { sealed(B) }                   A answers
 *
 * So the INVITER ends up as the WebRTC answerer. That is deliberate: it means
 * the side that accepts is the side that starts gathering ICE, so a declined
 * invite costs no STUN traffic at all.
 *
 * ICE is non-trickle — each side gathers fully before publishing — so the whole
 * call costs three statements rather than one per candidate. Statement
 * allowance is the scarce resource here; a few hundred milliseconds of extra
 * setup latency is not.
 */

import type { SealedSdp } from '@/lib/voice/sdpSeal'

interface VoiceBase {
  /** Game this call belongs to. Scopes the call and routes the statement. */
  gameId: string
  /** SS58 of the sender, as claimed in the payload. */
  from: string
  /** SS58 of the intended recipient. Receivers drop anything not addressed to them. */
  to: string
  timestamp: number
}

/** "Want to talk?" — carries the inviter's session box public key. */
export interface VoiceInviteStatement extends VoiceBase {
  type: 'voice_invite'
  boxPub: string
}

/** Accepted, with the WebRTC offer sealed to the inviter's box key. */
export interface VoiceOfferStatement extends VoiceBase {
  type: 'voice_offer'
  boxPub: string
  sealed: SealedSdp
}

/** The answer, sealed to the offerer's box key. */
export interface VoiceAnswerStatement extends VoiceBase {
  type: 'voice_answer'
  sealed: SealedSdp
}

/** Invite refused. Distinct from `voice_end` so the UI can say "declined"
 *  rather than "call ended", which reads as a fault. */
export interface VoiceDeclineStatement extends VoiceBase {
  type: 'voice_decline'
}

/** Hang up, from either side and at any stage. */
export interface VoiceEndStatement extends VoiceBase {
  type: 'voice_end'
}

export type VoiceStatement =
  | VoiceInviteStatement
  | VoiceOfferStatement
  | VoiceAnswerStatement
  | VoiceDeclineStatement
  | VoiceEndStatement

export const VOICE_STATEMENT_TYPES = [
  'voice_invite',
  'voice_offer',
  'voice_answer',
  'voice_decline',
  'voice_end',
] as const

/**
 * Is this decoded payload a voice statement?
 *
 * Used by the statement store to route a message away from the game log before
 * it is ingested. It deliberately checks only the discriminant and the routing
 * fields — a malformed `sealed` blob is the voice layer's problem to reject,
 * and misrouting it into the game log would be worse than handling it there.
 */
export function isVoiceStatement(v: unknown): v is VoiceStatement {
  if (!v || typeof v !== 'object') return false
  const s = v as Record<string, unknown>
  return (
    typeof s.type === 'string' &&
    (VOICE_STATEMENT_TYPES as readonly string[]).includes(s.type) &&
    typeof s.gameId === 'string' &&
    typeof s.from === 'string' &&
    typeof s.to === 'string'
  )
}
