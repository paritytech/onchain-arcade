# P2P voice (and video) between players

Research note. How to add a live audio conversation between the players in a
match, and what changes when it becomes video.

**Verdict:** feasible with no new infrastructure. The Statement Store already
carries every move between players, so it can carry the WebRTC handshake too;
after that, media flows browser-to-browser and never touches a chain. Most of
the parts exist and are proven in `../spotlight-mesh` — this is an integration,
not a build.

## What already exists

Lift-and-adapt from `../spotlight-mesh`; nothing below needs to be invented.

| Piece | File there | What it gives us |
|---|---|---|
| ICE config | `src/lib/webrtc/iceConfig.ts` | 6 STUN + 4 TURN flavours, env-overridable. ~99% connect rate vs ~85% on STUN alone |
| Host device permissions | `src/lib/webrtc/hostPermissions.ts` | `requestDevicePermission('Microphone')` — **required**, see Constraints |
| Capture + fallback probing | `src/lib/webrtc/mediaUtils.ts` | `getUserMedia` with per-device diagnosis when one is blocked |
| Peer connection | `src/lib/swarm/SwarmPeer.ts` | `RTCPeerConnection` + non-trickle ICE gathering wait |
| Two-statement handshake | `src/lib/swarm/joinSignaling.ts` | offer → answer over the Statement Store, with a watchdog |
| SDP sealing | `src/lib/swarm/sdpSeal.ts` | X25519 → HKDF → AES-GCM. **Required**, see Constraints |

## Shape of it — two-player voice

```
Player X                    Statement Store                    Player O
   │  voice-offer (sealed SDP, topic ttt:{GAMEID}) ─────────────►│
   │◄──────────────── voice-answer (sealed SDP) ─────────────────│
   │                                                             │
   └══════════ SRTP audio, direct (or via TURN) ════════════════►│
```

Two statements per call, then the store is out of the loop. Non-trickle ICE
(gather fully before publishing) is what keeps it at two rather than one per
candidate — statement quota is the scarce resource, not latency.

The caller is whoever taps "Talk" first; ties break on SS58 ordering so two
simultaneous taps do not produce two half-connections.

## Work to do

| Module | Purpose |
|---|---|
| `src/lib/voice/VoiceSession.ts` | One `RTCPeerConnection` per opponent: offer/answer, track add/remove, teardown on game end |
| `src/lib/voice/signaling.ts` | `voice-offer` / `voice-answer` / `voice-leave` envelopes on the existing per-game topic |
| `src/lib/webrtc/iceConfig.ts` | Copied as-is |
| `src/lib/webrtc/hostPermissions.ts` | Copied; `Microphone` only until video lands |
| `src/components/VoiceBar.tsx` | Join/leave, mute, per-peer level meter, connection state |
| `src/types/game.ts` | Three new statement types alongside `create_game` / `join_game` / `make_move` |

Statements stay **out** of the game deriver — voice is presence, not game
state, so replaying a match must not replay a phone call.

## Constraints that will bite

- **The host maps every `getUserMedia` to one `Camera` permission.** Inside the
  Polkadot Desktop webview the microphone never gets its OS-level (macOS TCC)
  prompt, so `getUserMedia({audio:true})` rejects even after the user approves
  the host dialog. Call `requestDevicePermission('Microphone')` **first**, one
  device at a time. This is the single most likely cause of "voice does nothing
  on desktop".
- **A non-trickle SDP contains the player's public IP** (the STUN
  server-reflexive candidate), and the Statement Store is a public bulletin
  board anyone can subscribe to. Publishing raw SDP deanonymises both players
  to every observer. Seal it (`sdpSeal.ts`) — X25519 sealed box to the
  opponent's session key, advertised in the existing game statements.
- **Statement quota is per day-slot.** The RFC-0010 `StatementStoreAllowance`
  the app already requests covers moves; two more statements per call is
  negligible, but a reconnect loop that re-offers on every failure is not.
  Bound retries.
- **TURN is a third party.** The default Open Relay (metered.ca) sees
  ciphertext only, but it is someone else's uptime. Set `VITE_TURN_*` to a
  coturn instance before this is anything but a demo.
- **Mobile**: Safari/iOS needs a user gesture before `getUserMedia`, and the
  audio element must be `playsinline`. Backgrounding suspends the track —
  re-acquire on `visibilitychange` rather than assuming the session survived.

## Extending to video

Same connection, same signaling — add a video track and renegotiate. The real
cost is not the plumbing:

| | Audio only | + Video |
|---|---|---|
| Bitrate per peer | ~24–40 kbps (Opus) | ~500 kbps–1.2 Mbps (VP8/H.264) |
| Battery / thermals on mobile | negligible | significant |
| Screen real estate | a bar | competes with the board |

Recommendation: **ship audio first, gate video behind a toggle.** For a board
game the audio is the social payload; video mostly costs the player the board
they came to look at. When it lands, cap at 320×240 @ 15 fps — a thumbnail
beside the board, not a call UI.

## Beyond two players

Eleven of the twelve games are 1v1, where a full mesh is one connection. Emoji
Pictionary is 3–8, where mesh cost grows as n(n−1):

| Players | Connections | Upstream per player (audio) | Verdict |
|---|---|---|---|
| 2 | 1 | ~32 kbps | fine |
| 4 | 6 | ~96 kbps | fine |
| 6 | 15 | ~160 kbps | upper limit on mobile |
| 8 | 28 | ~224 kbps | needs mixing or an SFU |

Audio is cheap enough that a full mesh holds to 6. Past that — or for video at
any size above 2 — the options are an SFU (a server, which contradicts the
premise) or client-side mixing along spotlight-mesh's chunk-swarm lines. Out of
scope until a party game actually fills up.

## Open questions

1. Does the browser shell (dot.li) iframe carry `allow="microphone"`? If not,
   voice is desktop/mobile-only until the host adds it. **Test before building.**
2. Ephemeral voice keys — mint per match, or reuse the product account? Per
   match is cleaner but adds a key-exchange statement.
3. Push-to-talk or open mic? Open mic is one less thing to explain; push-to-talk
   is kinder to a 6-player game.
