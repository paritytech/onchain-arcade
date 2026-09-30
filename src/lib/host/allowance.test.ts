import { beforeEach, describe, expect, it, vi } from 'vitest'

// Node has no localStorage; the grant memo is the thing under test.
const store = new Map<string, string>()
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  clear: () => store.clear(),
})

const requestAllocation = vi.fn()

vi.mock('@parity/product-sdk/host', () => ({
  isInsideContainer: async () => true,
  requestPermission: async () => ({ ok: true, value: true }),
}))
vi.mock('./allocation', () => ({
  requestAllocation: (...args: unknown[]) => requestAllocation(...args),
}))

import { ensureStatementGrants, resetStatementGrants } from './allowance'

describe('ensureStatementGrants', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStatementGrants()
    requestAllocation.mockReset()
    requestAllocation.mockResolvedValue({
      status: 'ok',
      outcomes: { StatementStoreAllowance: 'Allocated' },
    })
  })

  it('asks once per account, across sessions in the same slot', async () => {
    expect(await ensureStatementGrants('alice')).toBe('granted')
    expect(await ensureStatementGrants('alice')).toBe('granted')
    resetStatementGrants() // a reload: only localStorage survives
    expect(await ensureStatementGrants('alice')).toBe('granted')
    expect(requestAllocation).toHaveBeenCalledTimes(1)
  })

  it('asks again for a different account', async () => {
    await ensureStatementGrants('alice')
    await ensureStatementGrants('bob')
    expect(requestAllocation).toHaveBeenCalledTimes(2)
  })
})
