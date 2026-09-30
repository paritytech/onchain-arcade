import { describe, it, expect } from 'vitest'
import { generateBoxKey, sealSdp, openSdp, isSealedSdp } from './sdpSeal'

// A realistic non-trickle SDP fragment — the thing that must never travel in
// the clear, because the srflx candidate line is the player's public IP.
const SDP = [
  'v=0',
  'o=- 4611731400430051336 2 IN IP4 127.0.0.1',
  'm=audio 9 UDP/TLS/RTP/SAVPF 111',
  'a=candidate:1 1 udp 2113937151 192.168.1.42 54321 typ host',
  'a=candidate:2 1 udp 1677729535 203.0.113.77 54321 typ srflx raddr 192.168.1.42',
  'a=fingerprint:sha-256 AB:CD:EF',
].join('\r\n')

describe('sdpSeal', () => {
  it('round-trips an SDP to the intended recipient', async () => {
    const bob = generateBoxKey()
    const sealed = await sealSdp(bob.publicKeyHex, SDP)
    expect(await openSdp(bob, sealed)).toBe(SDP)
  })

  it('does not leak the SDP into the sealed envelope', async () => {
    const bob = generateBoxKey()
    const sealed = await sealSdp(bob.publicKeyHex, SDP)
    const wire = JSON.stringify(sealed)
    // The whole point: no IP, no candidate line, nothing readable.
    expect(wire).not.toContain('203.0.113.77')
    expect(wire).not.toContain('192.168.1.42')
    expect(wire).not.toContain('candidate')
    expect(wire).not.toContain('fingerprint')
  })

  it('refuses to open for the wrong recipient', async () => {
    const bob = generateBoxKey()
    const mallory = generateBoxKey()
    const sealed = await sealSdp(bob.publicKeyHex, SDP)
    await expect(openSdp(mallory, sealed)).rejects.toThrow()
  })

  it('refuses a tampered ciphertext (AEAD holds)', async () => {
    const bob = generateBoxKey()
    const sealed = await sealSdp(bob.publicKeyHex, SDP)
    // Flip one nibble of the ciphertext.
    const flipped = sealed.ct.slice(0, -1) + (sealed.ct.slice(-1) === 'a' ? 'b' : 'a')
    await expect(openSdp(bob, { ...sealed, ct: flipped })).rejects.toThrow()
  })

  it('refuses a swapped ephemeral key', async () => {
    const bob = generateBoxKey()
    const sealed = await sealSdp(bob.publicKeyHex, SDP)
    const other = await sealSdp(bob.publicKeyHex, 'v=0')
    await expect(openSdp(bob, { ...sealed, epk: other.epk })).rejects.toThrow()
  })

  it('produces a fresh ephemeral key and nonce per seal', async () => {
    const bob = generateBoxKey()
    const a = await sealSdp(bob.publicKeyHex, SDP)
    const b = await sealSdp(bob.publicKeyHex, SDP)
    expect(a.epk).not.toBe(b.epk)
    expect(a.iv).not.toBe(b.iv)
    expect(a.ct).not.toBe(b.ct) // same plaintext, different ciphertext
  })

  it('rejects an empty SDP', async () => {
    const bob = generateBoxKey()
    await expect(sealSdp(bob.publicKeyHex, '')).rejects.toThrow(/outside/)
  })

  it('validates wire shape before the crypto sees it', () => {
    expect(isSealedSdp({ epk: 'aa'.repeat(32), iv: 'bb'.repeat(12), ct: 'cc' })).toBe(true)
    expect(isSealedSdp(null)).toBe(false)
    expect(isSealedSdp({ epk: 'short', iv: 'bb'.repeat(12), ct: 'cc' })).toBe(false)
    expect(isSealedSdp({ epk: 'aa'.repeat(32), iv: 'bb', ct: 'cc' })).toBe(false)
    expect(isSealedSdp({ epk: 'aa'.repeat(32), iv: 'bb'.repeat(12), ct: '' })).toBe(false)
    expect(isSealedSdp({ epk: 'zz'.repeat(32), iv: 'bb'.repeat(12), ct: 'cc' })).toBe(false)
  })
})
