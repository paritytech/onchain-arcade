// Minimal SCALE codec for Substrate Statement Store fields.
// Only encodes the types needed: Compact<u32>, u64, [u8;N], Vec<u8>, Field enum, Proof enum.

/** Encode a Compact<u32> integer. */
export function encodeCompact(value: number): Uint8Array {
  if (value < 64) {
    return new Uint8Array([value << 2])
  }
  if (value < 16384) {
    const v = (value << 2) | 0b01
    return new Uint8Array([v & 0xff, (v >> 8) & 0xff])
  }
  if (value < 1073741824) {
    const v = (value << 2) | 0b10
    return new Uint8Array([v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff])
  }
  throw new Error(`Compact value too large: ${value}`)
}

/** Decode a Compact<u32> from bytes, returns [value, bytesConsumed]. */
export function decodeCompact(data: Uint8Array, offset = 0): [number, number] {
  const mode = data[offset] & 0b11
  if (mode === 0b00) {
    return [data[offset] >> 2, 1]
  }
  if (mode === 0b01) {
    const v = data[offset] | (data[offset + 1] << 8)
    return [v >> 2, 2]
  }
  if (mode === 0b10) {
    const v = data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24)
    return [(v >>> 2), 4]
  }
  throw new Error('Big integer compact not supported')
}

/** Encode u64 as 8-byte little-endian. */
export function encodeU64(value: bigint | number): Uint8Array {
  const v = BigInt(value)
  const buf = new Uint8Array(8)
  for (let i = 0; i < 8; i++) {
    buf[i] = Number((v >> BigInt(i * 8)) & 0xffn)
  }
  return buf
}

/** Decode u64 from 8-byte little-endian. */
export function decodeU64(data: Uint8Array, offset = 0): bigint {
  let v = 0n
  for (let i = 0; i < 8; i++) {
    v |= BigInt(data[offset + i]) << BigInt(i * 8)
  }
  return v
}

/** Encode Vec<u8>: compact length prefix + raw bytes. */
export function encodeVec(data: Uint8Array): Uint8Array {
  const lenPrefix = encodeCompact(data.length)
  const result = new Uint8Array(lenPrefix.length + data.length)
  result.set(lenPrefix, 0)
  result.set(data, lenPrefix.length)
  return result
}

/** Decode Vec<u8>: compact length prefix + raw bytes. Returns [data, totalBytesConsumed]. */
export function decodeVec(data: Uint8Array, offset = 0): [Uint8Array, number] {
  const [len, lenBytes] = decodeCompact(data, offset)
  return [data.slice(offset + lenBytes, offset + lenBytes + len), lenBytes + len]
}

/** Concatenate multiple Uint8Arrays. */
export function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLen = arrays.reduce((sum, a) => sum + a.length, 0)
  const result = new Uint8Array(totalLen)
  let offset = 0
  for (const a of arrays) {
    result.set(a, offset)
    offset += a.length
  }
  return result
}

/** Hex-encode bytes to '0x'-prefixed string. */
export function toHex(data: Uint8Array): string {
  return '0x' + Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('')
}

/** Decode '0x'-prefixed hex string to bytes. */
export function fromHex(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

// --- Statement Store Field/Proof encoding ---

// Field discriminants (must appear in ascending order in encoded statement)
export const FIELD_TAG = {
  AuthenticityProof: 0,
  DecryptionKey: 1,
  Expiry: 2,
  Channel: 3,
  Topic1: 4,
  Topic2: 5,
  Topic3: 6,
  Topic4: 7,
  Data: 8,
} as const

// Proof variant discriminants
export const PROOF_TAG = {
  Sr25519: 0,
  Ed25519: 1,
  Secp256k1Ecdsa: 2,
  OnChain: 3,
} as const

export interface StatementProof {
  proofTag: number      // PROOF_TAG.Sr25519 or PROOF_TAG.Ed25519
  signature: Uint8Array // 64 bytes
  signer: Uint8Array    // 32 bytes
}

// Backwards compat alias
export type Sr25519Proof = StatementProof

export interface StatementFields {
  expiry: bigint
  channel?: Uint8Array    // 32 bytes
  topics: Uint8Array[]    // up to 4 topics, each 32 bytes
  data?: Uint8Array
}

/** Encode the signature material (for signing): fields without proof, no compact prefix. */
export function encodeSignatureMaterial(fields: StatementFields): Uint8Array {
  const parts: Uint8Array[] = []

  // Expiry (tag=2) — always present
  parts.push(new Uint8Array([FIELD_TAG.Expiry]))
  parts.push(encodeU64(fields.expiry))

  // Channel (tag=3)
  if (fields.channel) {
    parts.push(new Uint8Array([FIELD_TAG.Channel]))
    parts.push(fields.channel)
  }

  // Topics (tags 4-7)
  for (let i = 0; i < fields.topics.length && i < 4; i++) {
    parts.push(new Uint8Array([FIELD_TAG.Topic1 + i]))
    parts.push(fields.topics[i])
  }

  // Data (tag=8)
  if (fields.data) {
    parts.push(new Uint8Array([FIELD_TAG.Data]))
    parts.push(encodeVec(fields.data))
  }

  return concat(...parts)
}

/** Encode a full statement with proof for submission. */
export function encodeStatement(fields: StatementFields, proof: StatementProof): Uint8Array {
  // Count fields: proof + expiry + channel? + topics + data?
  let numFields = 2 // proof + expiry
  if (fields.channel) numFields++
  numFields += Math.min(fields.topics.length, 4)
  if (fields.data) numFields++

  const parts: Uint8Array[] = []

  // Compact field count
  parts.push(encodeCompact(numFields))

  // AuthenticityProof (tag=0)
  parts.push(new Uint8Array([FIELD_TAG.AuthenticityProof]))
  // Proof variant tag + signature(64) + signer(32)
  parts.push(new Uint8Array([proof.proofTag]))
  parts.push(proof.signature)
  parts.push(proof.signer)

  // Expiry (tag=2)
  parts.push(new Uint8Array([FIELD_TAG.Expiry]))
  parts.push(encodeU64(fields.expiry))

  // Channel (tag=3)
  if (fields.channel) {
    parts.push(new Uint8Array([FIELD_TAG.Channel]))
    parts.push(fields.channel)
  }

  // Topics (tags 4-7)
  for (let i = 0; i < fields.topics.length && i < 4; i++) {
    parts.push(new Uint8Array([FIELD_TAG.Topic1 + i]))
    parts.push(fields.topics[i])
  }

  // Data (tag=8)
  if (fields.data) {
    parts.push(new Uint8Array([FIELD_TAG.Data]))
    parts.push(encodeVec(fields.data))
  }

  return concat(...parts)
}

/** Decode a statement's fields from SCALE bytes. Extracts topics and data. */
export function decodeStatementFields(encoded: Uint8Array): {
  topics: Uint8Array[]
  data: Uint8Array | null
  expiry: bigint
  signer: Uint8Array | null
} {
  let offset = 0
  const [fieldCount, compactBytes] = decodeCompact(encoded, offset)
  offset += compactBytes

  const topics: Uint8Array[] = []
  let data: Uint8Array | null = null
  let expiry = 0n
  let signer: Uint8Array | null = null

  for (let f = 0; f < fieldCount && offset < encoded.length; f++) {
    const tag = encoded[offset]
    offset++

    switch (tag) {
      case FIELD_TAG.AuthenticityProof: {
        const proofTag = encoded[offset]
        offset++
        if (proofTag === PROOF_TAG.Sr25519) {
          offset += 64 // signature
          signer = encoded.slice(offset, offset + 32)
          offset += 32
        } else if (proofTag === PROOF_TAG.Ed25519) {
          offset += 64
          signer = encoded.slice(offset, offset + 32)
          offset += 32
        } else if (proofTag === PROOF_TAG.Secp256k1Ecdsa) {
          offset += 65 // signature
          offset += 33 // compressed pubkey
        } else if (proofTag === PROOF_TAG.OnChain) {
          offset += 32 + 32 + 8 // who + block_hash + event_index
        }
        break
      }
      case FIELD_TAG.DecryptionKey:
        offset += 32
        break
      case FIELD_TAG.Expiry:
        expiry = decodeU64(encoded, offset)
        offset += 8
        break
      case FIELD_TAG.Channel:
        offset += 32
        break
      case FIELD_TAG.Topic1:
      case FIELD_TAG.Topic2:
      case FIELD_TAG.Topic3:
      case FIELD_TAG.Topic4:
        topics.push(encoded.slice(offset, offset + 32))
        offset += 32
        break
      case FIELD_TAG.Data: {
        const [vec, consumed] = decodeVec(encoded, offset)
        data = vec
        offset += consumed
        break
      }
      default:
        // Unknown field — can't continue safely
        return { topics, data, expiry, signer }
    }
  }

  return { topics, data, expiry, signer }
}
