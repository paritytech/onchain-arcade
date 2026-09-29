import { describe, it, expect } from 'vitest'
import { generateGameId, normalizeGameId, isValidGameId, GAME_ID_LENGTH } from './game'

describe('game codes', () => {
  it('never generates a confusable character', () => {
    // I/1, L/1 and O/0 are the transcription confusions people actually make.
    // Now that players can read a code aloud over the voice channel, this is
    // not hypothetical.
    for (let i = 0; i < 2000; i++) {
      const code = generateGameId()
      expect(code).toHaveLength(GAME_ID_LENGTH)
      expect(code).not.toMatch(/[ILOU01]/)
    }
  })

  it('generates codes that validate', () => {
    for (let i = 0; i < 200; i++) expect(isValidGameId(generateGameId())).toBe(true)
  })

  it('still accepts codes from the older, wider alphabet', () => {
    // A link shared before the generator narrowed must keep working.
    expect(isValidGameId('LUCKY7')).toBe(true)
    expect(isValidGameId('ABCULX')).toBe(true)
  })

  it('rejects malformed codes', () => {
    expect(isValidGameId('ABC12')).toBe(false)   // too short
    expect(isValidGameId('ABCDEFG')).toBe(false) // too long
    expect(isValidGameId('ABC0EF')).toBe(false)  // 0 never issued
    expect(isValidGameId('abcdef')).toBe(false)  // caller normalizes first
  })

  it('normalizes the way a human actually mistypes', () => {
    expect(normalizeGameId('abc-def')).toBe('ABCDEF')
    expect(normalizeGameId('  ABC DEF  ')).toBe('ABCDEF')
    // 1 and I are never generated: someone typing them misread an L.
    expect(normalizeGameId('ABC1EF')).toBe('ABCLEF')
    expect(normalizeGameId('ABCIEF')).toBe('ABCLEF')
    expect(normalizeGameId('abc1ef')).toBe('ABCLEF')
    // Over-long paste is truncated rather than rejected.
    expect(normalizeGameId('ABCDEFGHIJ')).toBe('ABCDEF')
  })

  it('leaves 0 and O alone — neither maps anywhere unambiguous', () => {
    expect(normalizeGameId('ABC0EF')).toBe('ABC0EF')
    expect(normalizeGameId('ABCOEF')).toBe('ABCOEF')
    expect(isValidGameId(normalizeGameId('ABC0EF'))).toBe(false)
  })

  it('does not issue a code spelling something unfortunate', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 4000; i++) seen.add(generateGameId())
    for (const code of seen) {
      expect(code).not.toContain('SEX')
      expect(code).not.toContain('ASS')
      expect(code).not.toContain('WTF')
    }
  })
})
