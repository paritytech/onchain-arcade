import { describe, it, expect } from 'vitest'
import WebSocket from 'ws'
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
    setTimeout(() => {
      ws.off('message', handler)
      reject(new Error(`RPC timeout: ${method}`))
    }, 15000)
  })
}

describe('Alice on Individuality Local', { timeout: 30000 }, () => {
  it('check Alice balance and submit a statement', async () => {
    const { Keyring } = await import('@polkadot/keyring')
    const { cryptoWaitReady } = await import('@polkadot/util-crypto')
    await cryptoWaitReady()

    const keyring = new Keyring({ type: 'sr25519' })
    const alice = keyring.addFromUri('//Alice')
    console.log('Alice SS58:', alice.address)
    console.log('Alice pubkey:', toHex(new Uint8Array(alice.publicKey)))

    const ws = await connectWs()
    try {
      // 1. Check Alice's balance on this chain
      const accountInfoHex = await rpcCall(ws, 'state_getStorage', [
        // System.Account storage key for Alice
        // twox128("System") ++ twox128("Account") ++ blake2_128_concat(alice.publicKey)
        // We'll use state_call instead for simplicity
      ]) as string | null
      console.log('Alice account storage (raw):', accountInfoHex ? 'exists' : 'empty')

      // 2. Try submitting a statement signed by Alice
      const topic1 = fromHex('0x' + 'ee'.repeat(32))
      const data = new TextEncoder().encode('{"type":"test_real_alice"}')

      const fields: StatementFields = {
        expiry: 18446744073709551614n,
        topics: [topic1],
        data,
      }

      const sigMaterial = encodeSignatureMaterial(fields)

      // Sign with Alice's sr25519 key (proper derivation)
      const signature = alice.sign(sigMaterial)
      console.log('Signature length:', signature.length)

      const encoded = encodeStatement(fields, {
        proofTag: PROOF_TAG.Sr25519,
        signature: new Uint8Array(signature),
        signer: new Uint8Array(alice.publicKey),
      })

      const result = await rpcCall(ws, 'statement_submit', [toHex(encoded)]) as Record<string, unknown>
      console.log('Alice submit result:', JSON.stringify(result))

      // If Alice has allowance: "new" or "known"
      // If not: "rejected" / "noAllowance"
      expect(result.status).toBeDefined()

      if (result.status === 'new' || result.status === 'known') {
        console.log('✅ Alice CAN submit statements! She has allowance.')
      } else {
        console.log('❌ Alice cannot submit:', result.status, result.reason)
      }
    } finally {
      ws.close()
    }
  })

  it('check Bob, Charlie, Dave allowance too', async () => {
    const { Keyring } = await import('@polkadot/keyring')
    const { cryptoWaitReady } = await import('@polkadot/util-crypto')
    await cryptoWaitReady()

    const keyring = new Keyring({ type: 'sr25519' })
    const ws = await connectWs()

    try {
      for (const name of ['//Alice', '//Bob', '//Charlie', '//Dave', '//Eve', '//Ferdie']) {
        const pair = keyring.addFromUri(name)

        const topic = fromHex('0x' + 'ff'.repeat(32))
        const data = new TextEncoder().encode(`{"test":"${name}"}`)
        const fields: StatementFields = {
          expiry: 18446744073709551614n,
          topics: [topic],
          data,
        }

        const sigMaterial = encodeSignatureMaterial(fields)
        const signature = pair.sign(sigMaterial)

        const encoded = encodeStatement(fields, {
          proofTag: PROOF_TAG.Sr25519,
          signature: new Uint8Array(signature),
          signer: new Uint8Array(pair.publicKey),
        })

        const result = await rpcCall(ws, 'statement_submit', [toHex(encoded)]) as Record<string, unknown>
        const ok = result.status === 'new' || result.status === 'known'
        console.log(`${name}: ${ok ? '✅' : '❌'} ${result.status}${result.reason ? ' / ' + result.reason : ''}`)
      }
    } finally {
      ws.close()
    }
  })
})
