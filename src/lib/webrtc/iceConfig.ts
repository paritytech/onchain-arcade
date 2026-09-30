/**
 * ICE server configuration for the 1-to-1 voice channel.
 *
 * Voice is peer-to-peer: audio flows directly browser-to-browser over SRTP.
 * Three layers make that connection work across the messy reality of NATs:
 *
 *   1. STUN — each peer asks "what is my public address?" and the answer goes
 *      in the SDP. One round-trip, ~1 KB, never carries audio. Enough on its
 *      own for roughly 80–90% of network pairs.
 *   2. TURN — last-resort relay for the rest: symmetric NAT (mobile carriers,
 *      restrictive corporate firewalls), some hotel and cafe WiFi. ICE only
 *      routes through TURN when no direct path exists; peers that can connect
 *      directly still do. Media is SRTP-encrypted end to end, so the relay
 *      carries ciphertext.
 *   3. Host candidates — the LAN fast path when both players are on the same
 *      network.
 *
 * STUN and TURN are both on by default, which takes connection success from
 * ~85% to ~99%. The default TURN is the free public Open Relay (metered.ca):
 * fine for development and a handful of concurrent games, someone else's
 * uptime and quota in production. Point VITE_TURN_* at your own coturn before
 * this carries real traffic.
 *
 * Knobs:
 *   - VITE_TURN_URL / VITE_TURN_USER / VITE_TURN_PASS (all three together):
 *     replace the default Open Relay with your own server.
 *   - VITE_DISABLE_TURN=1: no relay, ever. Calls that would have relayed fail
 *     honestly instead of transiting a third party. ~10–20% of network pairs
 *     will fail.
 *   - VITE_DISABLE_STUN=1: local-only. Calls succeed only between peers that
 *     already see each other's host candidates (same LAN, public IPv6).
 */

type IceEnvSource = Partial<{
  VITE_TURN_URL: string;
  VITE_TURN_USER: string;
  VITE_TURN_PASS: string;
  VITE_DISABLE_STUN: string;
  VITE_DISABLE_TURN: string;
}>;

function readIceEnv(env?: IceEnvSource): Required<IceEnvSource> {
  const source = env ?? ((import.meta as { env?: IceEnvSource }).env ?? {});
  return {
    VITE_TURN_URL: source.VITE_TURN_URL ?? '',
    VITE_TURN_USER: source.VITE_TURN_USER ?? '',
    VITE_TURN_PASS: source.VITE_TURN_PASS ?? '',
    VITE_DISABLE_STUN: source.VITE_DISABLE_STUN ?? '',
    VITE_DISABLE_TURN: source.VITE_DISABLE_TURN ?? '',
  };
}

/**
 * STUN servers from independent operators. Each is contacted at most once per
 * peer, to learn that peer's own public address — none ever sees audio.
 * Diversity rather than one provider buys better port-mapping coverage on
 * awkward NATs and survives one operator rate-limiting or going down.
 * Cloudflare and Nextcloud also listen on 443, which slips through firewalls
 * that block the default STUN port 3478.
 */
const DEFAULT_STUN_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.cloudflare.com:3478' },
  { urls: 'stun:stun.cloudflare.com:443' },
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun.nextcloud.com:443' },
];

/**
 * Default TURN: the free public Open Relay. Four flavours so the browser has a
 * path through networks that block UDP, block 3478, or do deep packet
 * inspection — UDP/80, TCP/80, UDP/443, TLS/443 (which looks like HTTPS).
 */
const DEFAULT_TURN_SERVERS: RTCIceServer[] = [
  { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:80?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turns:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
];

/** Whether a custom TURN relay is configured. */
export function hasTurnConfig(env?: IceEnvSource): boolean {
  const { VITE_TURN_URL, VITE_TURN_USER, VITE_TURN_PASS } = readIceEnv(env);
  return !!(VITE_TURN_URL && VITE_TURN_USER && VITE_TURN_PASS);
}

/** Build the ICE server list. */
export function getIceServers(env?: IceEnvSource): RTCIceServer[] {
  const {
    VITE_TURN_URL,
    VITE_TURN_USER,
    VITE_TURN_PASS,
    VITE_DISABLE_STUN,
    VITE_DISABLE_TURN,
  } = readIceEnv(env);

  const servers: RTCIceServer[] = VITE_DISABLE_STUN === '1' ? [] : [...DEFAULT_STUN_SERVERS];

  // Reject a partial TURN config loudly — silently ignoring two of three set
  // vars looks like "TURN is on" and behaves like "TURN is off".
  const turnFields = [VITE_TURN_URL, VITE_TURN_USER, VITE_TURN_PASS].filter(Boolean).length;
  if (turnFields > 0 && turnFields < 3) {
    throw new Error(
      'Incomplete TURN config: set VITE_TURN_URL, VITE_TURN_USER and VITE_TURN_PASS together.',
    );
  }

  if (VITE_DISABLE_TURN === '1') return servers;

  if (VITE_TURN_URL && VITE_TURN_USER && VITE_TURN_PASS) {
    servers.push({ urls: VITE_TURN_URL, username: VITE_TURN_USER, credential: VITE_TURN_PASS });
  } else {
    servers.push(...DEFAULT_TURN_SERVERS);
  }

  return servers;
}
