import { describe, it, expect } from 'vitest'
import WebSocket from 'ws'
import { Keyring } from '@polkadot/keyring'
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto'
import {
  encodeSignatureMaterial,
  encodeStatement,
  toHex,
  fromHex,
  PROOF_TAG,
  type StatementFields,
} from './scale'

const WS_URL = 'wss://pop3-testnet.parity-lab.parity.io/people'

function connectWs(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL)
    ws.on('open', () => resolve(ws))
    ws.on('error', (err) => reject(err))
    setTimeout(() => reject(new Error('WS connect timeout')), 10000)
  })
}

function rpcCall(ws: WebSocket, method: string, params: unknown[]): Promise<unknown> {
  const id = Math.floor(Math.random() * 100000)
  return new Promise((resolve, reject) => {
    const handler = (raw: WebSocket.Data) => {
      const msg = JSON.parse(raw.toString())
      if (msg.id === id) {
        ws.off('message', handler)
        if (msg.error) reject(new Error(JSON.stringify(msg.error)))
        else resolve(msg.result)
      }
    }
    ws.on('message', handler)
    ws.send(JSON.stringify({ jsonrpc: '2.0', id, method, params }))
    setTimeout(() => { ws.off('message', handler); reject(new Error(`Timeout: ${method}`)) }, 15000)
  })
}

function buildAllowanceStorageKey(publicKey: Uint8Array): string {
  const prefix = new TextEncoder().encode(':statement-allowance:')
  const key = new Uint8Array(prefix.length + publicKey.length)
  key.set(prefix, 0)
  key.set(publicKey, prefix.length)
  return '0x' + Array.from(key).map(b => b.toString(16).padStart(2, '0')).join('')
}

function encodeAllowanceValue(count: number, maxSize: number): string {
  const buf = new Uint8Array(8)
  const view = new DataView(buf.buffer)
  view.setUint32(0, count, true)
  view.setUint32(4, maxSize, true)
  return '0x' + Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('')
}

describe('Game account provisioning + 30s expiry', { timeout: 30000 }, () => {
  it('full flow: generate account → grant allowance → submit with 30s expiry', async () => {
    await cryptoWaitReady()
    const ws = await connectWs()

    try {
      // 1. Generate a fresh game account
      const mnemonic = mnemonicGenerate()
      const keyring = new Keyring({ type: 'sr25519' })
      const gameAccount = keyring.addFromMnemonic(mnemonic)
      console.log('Game account:', gameAccount.address)
      console.log('Public key:', toHex(new Uint8Array(gameAccount.publicKey)))

      // 2. Check current allowance (should be 0)
      const storageKey = buildAllowanceStorageKey(new Uint8Array(gameAccount.publicKey))
      const before = await rpcCall(ws, 'state_getStorage', [storageKey])
      console.log('Allowance before:', before)
      expect(before).toBeNull()

      // 3. Grant allowance via system_setStorage (dev chain RPC)
      const storageValue = encodeAllowanceValue(20, 20480)
      await rpcCall(ws, 'system_setStorage', [[[storageKey, storageValue]]])
      console.log('Granted allowance: 20 statements, 20KB')

      // 4. Verify allowance
      const after = await rpcCall(ws, 'state_getStorage', [storageKey])
      console.log('Allowance after:', after)
      expect(after).toBe(storageValue)

      // 5. Submit a statement with 30-second expiry
      const topic = fromHex('0x' + 'ab'.repeat(32))
      const data = new TextEncoder().encode('{"type":"create_game","gameId":"TEST30","playerX":"5Test","timestamp":1234}')
      const expiryTimestamp = BigInt(Math.floor(Date.now() / 1000) + 30)
      const expiry = (expiryTimestamp << 32n) | 0n

      console.log('Expiry value:', expiry.toString())
      console.log('Expiry timestamp (seconds):', expiryTimestamp.toString())

      const fields: StatementFields = {
        expiry,
        topics: [topic],
        data,
      }

      const sigMaterial = encodeSignatureMaterial(fields)
      const signature = gameAccount.sign(sigMaterial)

      const encoded = encodeStatement(fields, {
        proofTag: PROOF_TAG.Sr25519,
        signature: new Uint8Array(signature),
        signer: new Uint8Array(gameAccount.publicKey),
      })

      const result = await rpcCall(ws, 'statement_submit', [toHex(encoded)]) as Record<string, unknown>
      console.log('Submit result:', JSON.stringify(result))

      expect(result.status).toBe('new')
      console.log('✅ Full flow works: generate → provision → submit with 30s expiry')
    } finally {
      ws.close()
    }
  })
})
