// Regression test for the connect/submit race.
//
// `statementStore.connectRpc()` selects the host transport synchronously and
// fires `connect()` WITHOUT awaiting it, then `GameContext.createGame` calls
// `applyAndSubmit` in the same synchronous run. So a submit reliably arrives
// before `getStatementStore()` has resolved. Reading `this.store` there found
// null and threw; `applyAndSubmit` swallowed the throw into a console.warn, so
// the first create/join of every host-mode session was dropped while the UI
// reported success.
//
// The old SDK's `createStatementStore()` was synchronous, which is why this
// could not happen before the migration — hence a test rather than a comment.

import { describe, it, expect, vi, beforeEach } from 'vitest'

/** Resolver for the pending getStatementStore(), set per test. */
let releaseStore: (store: unknown) => void
let getStatementStoreCalls = 0

const submitted: unknown[] = []

const fakeStore = {
  subscribe: () => ({ unsubscribe: () => {}, onInterrupt: () => () => {} }),
  createProofAuthorized: async () => ({ tag: 'Sr25519', value: { signature: '0x00', signer: '0x' + '11'.repeat(32) } }),
  submit: async (s: unknown) => { submitted.push(s) },
}

vi.mock('@parity/product-sdk/host', () => ({
  getStatementStore: () => {
    getStatementStoreCalls++
    return new Promise((resolve) => { releaseStore = resolve })
  },
  toHex: (b: Uint8Array) => '0x' + Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join(''),
  fromHex: (h: string) => {
    const body = h.startsWith('0x') ? h.slice(2) : h
    const out = new Uint8Array(body.length / 2)
    for (let i = 0; i < out.length; i++) out[i] = parseInt(body.slice(i * 2, i * 2 + 2), 16)
    return out
  },
}))

// The grant bootstrap reaches the host bridge; it is not what this test is about.
vi.mock('./host/allowance', () => ({
  ensureStatementGrants: async () => 'granted',
  GRANT_FAILURE_COPY: { timeout: '', rejected: '', unavailable: '' },
}))

const { statementStoreHost } = await import('./statementStoreHost')

const stmt = { type: 'create_game', gameId: 'ABC123', playerX: 'alice', timestamp: 1 } as never

describe('statementStoreHost connect/submit race', () => {
  beforeEach(() => {
    submitted.length = 0
    getStatementStoreCalls = 0
    statementStoreHost.disconnect()
  })

  it('a submit issued before the store resolves still publishes', async () => {
    // Exactly what connectRpc does: fire and forget.
    void statementStoreHost.connect(() => {})

    // Same synchronous run, as in GameContext.createGame.
    const submitPromise = statementStoreHost.submit(stmt)

    expect(submitted).toHaveLength(0) // nothing yet — the store has not arrived

    releaseStore(fakeStore)
    await submitPromise

    expect(submitted).toHaveLength(1)
  })

  it('reports honestly when the host serves no store', async () => {
    const fatals: string[] = []
    statementStoreHost.onFatalError = (e) => fatals.push(e.message)

    void statementStoreHost.connect(() => {})
    const submitPromise = statementStoreHost.submit(stmt)
    releaseStore(null) // outside a host container

    await expect(submitPromise).rejects.toThrow(/Not connected/)
    expect(fatals).toHaveLength(1)
    expect(submitted).toHaveLength(0)
    statementStoreHost.onFatalError = undefined
  })

  it('concurrent connects share one attach', async () => {
    const a = statementStoreHost.connect(() => {})
    const b = statementStoreHost.connect(() => {})
    releaseStore(fakeStore)
    await Promise.all([a, b])
    expect(getStatementStoreCalls).toBe(1)
  })
})
