/**
 * SDP sealing: X25519 sealed-box encryption for session descriptions.
 * Pure logic — no DOM, no WebRTC — so the crypto is testable on its own.
 *
 * Why this is not optional. A non-trickle SDP embeds the sender's public IP
 * (the STUN server-reflexive candidate), and the signalling path for voice is
 * the Statement Store: a public bulletin board that anyone can subscribe to.
 * Publishing a raw SDP would hand both players' home IP addresses to every
 * observer of the app topic, for a feature they opted into expecting a private
 * call. Sealing to the recipient's session key means only the two endpoints
 * ever see each other's addresses; everyone in between carries ciphertext.
 *
 * Threat model: confidentiality against passive observers. NOT authentication.
 * An active attacker who can substitute a box public key in the invite can
 * still man-in-the-middle the call — the box keys travel in statements whose
 * signer is chain-verified but whose authorship this app does not yet enforce
 * (see the note on ss58FromProof in ../statementStoreHost.ts). Closing that is
 * the same piece of work.
 *
 * Construction: per-message ephemeral X25519 -> HKDF-SHA256 (info binds the
 * protocol label and both public keys) -> AES-256-GCM. Each peer mints one box
 * keypair per call; the public halves travel in the invite and offer.
 *
 * Ported from ../../../spotlight-mesh/src/lib/swarm/sdpSeal.ts, which runs this
 * construction in production.
 */

import { x25519 } from '@noble/curves/ed25519.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

export interface BoxKeyPair {
  secretKey: Uint8Array;
  publicKey: Uint8Array;
  /** Hex form of publicKey — what the invite and offer advertise. */
  publicKeyHex: string;
}

/** A sealed SDP as it travels inside a voice statement. */
export interface SealedSdp {
  /** Sender's per-message ephemeral X25519 public key, hex (64 chars). */
  epk: string;
  /** AES-GCM nonce, hex (24 chars). */
  iv: string;
  /** AES-256-GCM ciphertext plus tag, hex. */
  ct: string;
}

const INFO_LABEL = new TextEncoder().encode('onchain-arcade:voice-sdp:v1');
/** A voice SDP is a few KB. The bound is a sanity check on a value that ends up
 *  in a statement, not a protocol limit. */
const SDP_MAX_BYTES = 50_000;

/** Mint a session box keypair. One per call, never reused across calls. */
export function generateBoxKey(): BoxKeyPair {
  const { secretKey, publicKey } = x25519.keygen();
  return { secretKey, publicKey, publicKeyHex: bytesToHex(publicKey) };
}

/** HKDF info = label ‖ epk ‖ recipientPub: binds the derived key to this
 *  protocol and this pair, so a transcript cannot be replayed elsewhere. */
function deriveAesKeyBytes(
  shared: Uint8Array,
  epk: Uint8Array,
  recipientPub: Uint8Array,
): Uint8Array {
  const info = new Uint8Array(INFO_LABEL.length + epk.length + recipientPub.length);
  info.set(INFO_LABEL, 0);
  info.set(epk, INFO_LABEL.length);
  info.set(recipientPub, INFO_LABEL.length + epk.length);
  return hkdf(sha256, shared, undefined, info, 32);
}

/** RFC 7748 contributory-behaviour check: a low-order peer point yields an
 *  all-zero shared secret. Reject it rather than encrypt to a key the attacker
 *  already knows. */
function sharedSecret(secretKey: Uint8Array, publicKey: Uint8Array): Uint8Array {
  const shared = x25519.getSharedSecret(secretKey, publicKey);
  if (shared.every((b) => b === 0)) throw new Error('low-order X25519 public key');
  return shared;
}

async function importAesKey(keyBytes: Uint8Array, usage: KeyUsage): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', keyBytes as BufferSource, 'AES-GCM', false, [usage]);
}

/** Seal an SDP to a recipient's session box public key. */
export async function sealSdp(recipientPubHex: string, sdp: string): Promise<SealedSdp> {
  const sdpBytes = new TextEncoder().encode(sdp);
  if (sdpBytes.length === 0 || sdpBytes.length > SDP_MAX_BYTES) {
    throw new Error(`SDP size ${sdpBytes.length} outside (0, ${SDP_MAX_BYTES}]`);
  }
  const recipientPub = hexToBytes(recipientPubHex);
  const eph = x25519.keygen();
  const keyBytes = deriveAesKeyBytes(
    sharedSecret(eph.secretKey, recipientPub),
    eph.publicKey,
    recipientPub,
  );
  const key = await importAesKey(keyBytes, 'encrypt');
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, sdpBytes as BufferSource);
  return {
    epk: bytesToHex(eph.publicKey),
    iv: bytesToHex(iv),
    ct: bytesToHex(new Uint8Array(ct)),
  };
}

/**
 * Open a sealed SDP with our session keypair. Throws on any mismatch — wrong
 * recipient, tampered ciphertext, malformed hex. Callers treat a throw as
 * "drop this message", NEVER as a fallback to plaintext: a downgrade path here
 * would defeat the whole module, since an attacker who can make decryption
 * fail could then read the retry.
 */
export async function openSdp(keyPair: BoxKeyPair, sealed: SealedSdp): Promise<string> {
  const epk = hexToBytes(sealed.epk);
  const keyBytes = deriveAesKeyBytes(
    sharedSecret(keyPair.secretKey, epk),
    epk,
    keyPair.publicKey,
  );
  const key = await importAesKey(keyBytes, 'decrypt');
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: hexToBytes(sealed.iv) as BufferSource },
    key,
    hexToBytes(sealed.ct) as BufferSource,
  );
  return new TextDecoder().decode(plain);
}

/** Shape check for a value arriving off the wire, before it reaches the crypto. */
export function isSealedSdp(v: unknown): v is SealedSdp {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.epk === 'string' && /^[0-9a-f]{64}$/i.test(s.epk) &&
    typeof s.iv === 'string' && /^[0-9a-f]{24}$/i.test(s.iv) &&
    typeof s.ct === 'string' && /^[0-9a-f]+$/i.test(s.ct) && s.ct.length > 0
  );
}
