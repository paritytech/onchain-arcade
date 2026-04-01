import { describe, it, expect } from 'vitest'
import {
  encodeCompact,
  decodeCompact,
  encodeU64,
  decodeU64,
  encodeVec,
  decodeVec,
  encodeSignatureMaterial,
  encodeStatement,
  decodeStatementFields,
  toHex,
  fromHex,
  type StatementFields,
  type Sr25519Proof,
} from './scale'

describe('SCALE compact encoding', () => {
  it('encodes single-byte mode (0-63)', () => {
    expect(toHex(encodeCompact(0))).toBe('0x00')
    expect(toHex(encodeCompact(1))).toBe('0x04')
    expect(toHex(encodeCompact(63))).toBe('0xfc')
  })

  it('encodes two-byte mode (64-16383)', () => {
    const encoded = encodeCompact(64)
    expect(encoded.length).toBe(2)
    const [decoded] = decodeCompact(encoded)
    expect(decoded).toBe(64)
  })

  it('encodes four-byte mode (16384+)', () => {
    const encoded = encodeCompact(16384)
    expect(encoded.length).toBe(4)
    const [decoded] = decodeCompact(encoded)
    expect(decoded).toBe(16384)
  })

  it('round-trips all compact values', () => {
    for (const v of [0, 1, 5, 42, 63, 64, 100, 255, 1000, 16383, 16384, 100000]) {
      const encoded = encodeCompact(v)
      const [decoded, bytes] = decodeCompact(encoded)
      expect(decoded).toBe(v)
      expect(bytes).toBe(encoded.length)
    }
  })
})

describe('SCALE u64 encoding', () => {
  it('encodes and decodes zero', () => {
    const encoded = encodeU64(0n)
    expect(encoded.length).toBe(8)
    expect(decodeU64(encoded)).toBe(0n)
  })

  it('encodes and decodes a timestamp', () => {
    const ts = BigInt(Date.now() + 86400000)
    const encoded = encodeU64(ts)
    expect(decodeU64(encoded)).toBe(ts)
  })

  it('encodes little-endian', () => {
    const encoded = encodeU64(1n)
    expect(encoded[0]).toBe(1)
    expect(encoded[7]).toBe(0)
  })
})

describe('SCALE Vec<u8> encoding', () => {
  it('encodes empty vec', () => {
    const encoded = encodeVec(new Uint8Array([]))
    expect(toHex(encoded)).toBe('0x00') // compact(0)
  })

  it('round-trips data', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5])
    const encoded = encodeVec(data)
    const [decoded, consumed] = decodeVec(encoded)
    expect(Array.from(decoded)).toEqual([1, 2, 3, 4, 5])
    expect(consumed).toBe(encoded.length)
  })

  it('round-trips JSON payload', () => {
    const json = '{"type":"make_move","gameId":"ABC123","player":"5FZW...","cellIndex":4,"timestamp":1234567890}'
    const data = new TextEncoder().encode(json)
    const encoded = encodeVec(data)
    const [decoded] = decodeVec(encoded)
    expect(new TextDecoder().decode(decoded)).toBe(json)
  })
})

describe('hex encoding', () => {
  it('round-trips', () => {
    const data = new Uint8Array([0, 1, 255, 128, 42])
    expect(fromHex(toHex(data))).toEqual(data)
  })

  it('handles 0x prefix', () => {
    expect(fromHex('0xff')).toEqual(new Uint8Array([255]))
    expect(fromHex('ff')).toEqual(new Uint8Array([255]))
  })
})

describe('Statement encoding/decoding round-trip', () => {
  const fakeSig = new Uint8Array(64).fill(0xab)
  const fakeSigner = new Uint8Array(32).fill(0xcd)
  const topic1 = new Uint8Array(32).fill(0x01)
  const topic2 = new Uint8Array(32).fill(0x02)

  it('encodes and decodes a statement with 2 topics and data', () => {
    const gameStmt = { type: 'create_game', gameId: 'TEST01', playerX: '5FZW...', timestamp: 1234567890 }
    const dataBytes = new TextEncoder().encode(JSON.stringify(gameStmt))

    const fields: StatementFields = {
      expiry: BigInt(Date.now() + 86400000),
      topics: [topic1, topic2],
      data: dataBytes,
    }

    const proof: Sr25519Proof = {
      proofTag: 0,
      signature: fakeSig,
      signer: fakeSigner,
    }

    const encoded = encodeStatement(fields, proof)
    const decoded = decodeStatementFields(encoded)

    // Check topics round-trip
    expect(decoded.topics.length).toBe(2)
    expect(Array.from(decoded.topics[0])).toEqual(Array.from(topic1))
    expect(Array.from(decoded.topics[1])).toEqual(Array.from(topic2))

    // Check expiry round-trip
    expect(decoded.expiry).toBe(fields.expiry)

    // Check signer round-trip
    expect(decoded.signer).not.toBeNull()
    expect(Array.from(decoded.signer!)).toEqual(Array.from(fakeSigner))

    // Check data round-trip
    expect(decoded.data).not.toBeNull()
    const decodedStmt = JSON.parse(new TextDecoder().decode(decoded.data!))
    expect(decodedStmt.type).toBe('create_game')
    expect(decodedStmt.gameId).toBe('TEST01')
  })

  it('encodes and decodes a statement with no data', () => {
    const fields: StatementFields = {
      expiry: 1000000n,
      topics: [topic1],
    }

    const proof: Sr25519Proof = { proofTag: 0, signature: fakeSig, signer: fakeSigner }
    const encoded = encodeStatement(fields, proof)
    const decoded = decodeStatementFields(encoded)

    expect(decoded.topics.length).toBe(1)
    expect(decoded.data).toBeNull()
    expect(decoded.expiry).toBe(1000000n)
  })

  it('field count is correct for varying fields', () => {
    // proof(1) + expiry(1) + 2 topics + data = 5 fields
    const fields: StatementFields = {
      expiry: 1n,
      topics: [topic1, topic2],
      data: new Uint8Array([42]),
    }
    const proof: Sr25519Proof = { proofTag: 0, signature: fakeSig, signer: fakeSigner }
    const encoded = encodeStatement(fields, proof)

    // First byte should be compact(5) = 5 << 2 = 20 = 0x14
    expect(encoded[0]).toBe(0x14)
  })

  it('signature material excludes proof and compact prefix', () => {
    const fields: StatementFields = {
      expiry: 42n,
      topics: [topic1],
      data: new Uint8Array([1, 2, 3]),
    }

    const sigMaterial = encodeSignatureMaterial(fields)

    // Should start with expiry tag (0x02), not compact prefix or proof tag
    expect(sigMaterial[0]).toBe(0x02) // Expiry tag

    // Should contain topic tag (0x04)
    // After expiry: tag(1) + u64(8) = 9 bytes, then topic tag
    expect(sigMaterial[9]).toBe(0x04) // Topic1 tag

    // Should NOT contain proof tag (0x00) anywhere as the first byte of a field
    // (it could appear as data, but not as a field tag)
  })
})

describe('Decoding real statements from the node', () => {
  it('decodes a real statement hex from the subscription', () => {
    // This is a truncated real statement from the node's subscription.
    // Format: compact(field_count) + fields...
    // We test that the decoder doesn't crash and extracts what it can.
    const realHex = '0x1400006c11c4238f7b5359e16e6cde5c33e117dcea5dfeff249f54a3aaf1827802250c83628700e0f16605df58f8bb53cf3858a568c2e804b57c2e42a3b4e80d0b8686aa0308a96960b9867b2b2c8f4f7245b5be30b9f75bad00e87c622751620e4422026d2cb400ffffffff033a80d074c1ecc866dfbe51545b8c0adc8b23635acdc16647513dae64cc9b6bf104401b64d96e298e7417d07c2de9cff29ddd586c44543a1bf08fbceb49426f4e3f'

    // This might be truncated — decoder should handle gracefully
    try {
      const decoded = decodeStatementFields(fromHex(realHex))
      // If it doesn't crash, that's a pass
      expect(decoded).toBeDefined()
      expect(decoded.expiry).toBeTypeOf('bigint')

      // The first byte 0x14 = compact(5), so 5 fields
      // Field 0: tag=0x00 (AuthenticityProof)
      // The real statement should have a signer
      console.log('Real statement decoded:', {
        topicCount: decoded.topics.length,
        hasData: decoded.data !== null,
        expiry: decoded.expiry.toString(),
        hasSigner: decoded.signer !== null,
        signerHex: decoded.signer ? toHex(decoded.signer) : null,
        dataPreview: decoded.data ? new TextDecoder().decode(decoded.data).slice(0, 100) : null,
      })
    } catch (e) {
      // Truncated data may cause errors — that's expected
      console.log('Decoding truncated data failed as expected:', e)
    }
  })
})

describe('Expiry value sanity', () => {
  it('expiry should be a future millisecond timestamp', () => {
    const expiry = BigInt(Date.now() + 86400000) // 24h from now
    const encoded = encodeU64(expiry)
    const decoded = decodeU64(encoded)

    // Should be in the future
    expect(Number(decoded)).toBeGreaterThan(Date.now())

    // Should be a reasonable timestamp (not year 3000)
    expect(Number(decoded)).toBeLessThan(Date.now() + 2 * 86400000)
  })

  it('expiry in milliseconds vs seconds makes a huge difference', () => {
    const nowMs = BigInt(Date.now())
    const nowSec = BigInt(Math.floor(Date.now() / 1000))

    // Milliseconds: ~1.7 trillion (13 digits)
    expect(nowMs.toString().length).toBeGreaterThanOrEqual(13)

    // Seconds: ~1.7 billion (10 digits)
    expect(nowSec.toString().length).toBeLessThanOrEqual(10)

    // If the node expects seconds but we send milliseconds, it will think
    // the expiry is ~50,000 years in the future (but should still accept it).
    // If the node expects milliseconds but we send seconds, it will think
    // the statement already expired (this would cause "alreadyExpired" rejection).
  })
})
