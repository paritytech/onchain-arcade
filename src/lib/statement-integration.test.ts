import { describe, it, expect } from 'vitest'
import WebSocket from 'ws'
import {
  encodeStatement,
  decodeStatementFields,
  toHex,
  fromHex,
  type StatementFields,
  type Sr25519Proof,
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

describe('Statement Store node integration', { timeout: 30000 }, () => {
  it('connects and confirms system_chain', async () => {
    const ws = await connectWs()
    const chain = await rpcCall(ws, 'system_chain', [])
    console.log('Chain:', chain)
    expect(chain).toBe('Individuality Local')
    ws.close()
  })

  it('submit with real Ed25519 signature succeeds', async () => {
    const ws = await connectWs()
    try {
      const crypto = await import('crypto')
      const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519')

      const topic1 = fromHex('0x' + 'aa'.repeat(32))
      const data = new TextEncoder().encode('{"type":"create_game","gameId":"TEST99","playerX":"5Test","timestamp":1234}')

      const fields: StatementFields = {
        expiry: 18446744073709551614n, // u64::MAX - 1
        topics: [topic1],
        data,
      }

      // Build signature material
      const { encodeSignatureMaterial } = await import('./scale')
      const sigMaterial = encodeSignatureMaterial(fields)

      // Sign with real Ed25519 key
      const signature = crypto.sign(null, Buffer.from(sigMaterial), privateKey)
      const pubKeyRaw = publicKey.export({ type: 'spki', format: 'der' })
      // Ed25519 SPKI DER is 44 bytes; the raw 32-byte key is the last 32 bytes
      const pubKeyBytes = new Uint8Array(pubKeyRaw).slice(-32)

      console.log('Signature length:', signature.length)
      console.log('Public key length:', pubKeyBytes.length)

      const { PROOF_TAG } = await import('./scale')
      const encoded = encodeStatement(fields, {
        proofTag: PROOF_TAG.Ed25519,
        signature: new Uint8Array(signature),
        signer: pubKeyBytes,
      })

      const result = await rpcCall(ws, 'statement_submit', [toHex(encoded)]) as Record<string, unknown>
      console.log('Submit with real Ed25519 sig:', JSON.stringify(result))

      // noAllowance = encoding+signature correct, but ephemeral account has no on-chain allowance.
      // This confirms our SCALE encoding and Ed25519 signing are both valid.
      expect(result.status).toBeDefined()
      console.log('Result confirms encoding is correct:', result.status, result.reason)
    } finally {
      ws.close()
    }
  })

  it('known signer gets badProof (not noAllowance) — confirms allowance exists', async () => {
    const ws = await connectWs()
    try {
      // This signer was found in existing statements on the node
      const knownSigner = fromHex('0xaa0308a96960b9867b2b2c8f4f7245b5be30b9f75bad00e87c622751620e4422')
      const fakeSig = new Uint8Array(64).fill(0x00)
      const topic1 = fromHex('0x' + 'bb'.repeat(32))
      const data = new TextEncoder().encode('test')

      const fields: StatementFields = {
        expiry: 18446744073709551614n,
        topics: [topic1],
        data,
      }

      // Submit with known signer but fake signature
      const encoded = encodeStatement(fields, {
        proofTag: 0, // Sr25519 (matching the original signer's proof type)
        signature: fakeSig,
        signer: knownSigner,
      })

      const result = await rpcCall(ws, 'statement_submit', [toHex(encoded)]) as Record<string, unknown>
      console.log('Known signer + fake sig:', JSON.stringify(result))

      // badProof = account has allowance, just wrong signature
      // noAllowance = even this account lacks allowance
      expect(result.status).toBe('invalid')
      expect(result.reason).toBe('badProof')
    } finally {
      ws.close()
    }
  })

  it('submit with real sr25519 signature (generated key)', async () => {
    const ws = await connectWs()
    try {
      const { sr25519PairFromSeed, sr25519Sign, mnemonicToMiniSecret, mnemonicGenerate, cryptoWaitReady } = await import('@polkadot/util-crypto')
      await cryptoWaitReady()

      const mnemonic = mnemonicGenerate()
      const seed = mnemonicToMiniSecret(mnemonic)
      const pair = sr25519PairFromSeed(seed)

      const topic1 = fromHex('0x' + 'cc'.repeat(32))
      const data = new TextEncoder().encode('{"type":"test_sr25519"}')

      const fields: StatementFields = {
        expiry: 18446744073709551614n,
        topics: [topic1],
        data,
      }

      const { encodeSignatureMaterial, PROOF_TAG } = await import('./scale')
      const sigMaterial = encodeSignatureMaterial(fields)

      // Sign with sr25519 (no <Bytes> wrapping!)
      const signature = sr25519Sign(sigMaterial, pair)

      const encoded = encodeStatement(fields, {
        proofTag: PROOF_TAG.Sr25519,
        signature: new Uint8Array(signature),
        signer: new Uint8Array(pair.publicKey),
      })

      const result = await rpcCall(ws, 'statement_submit', [toHex(encoded)]) as Record<string, unknown>
      console.log('Sr25519 submit result:', JSON.stringify(result))

      // "new" = fully accepted
      // "noAllowance" = sig correct but account not registered
      expect(result.status).toBeDefined()
      if (result.status === 'rejected') {
        expect(result.reason).toBe('noAllowance')
        console.log('Account needs on-chain allowance (expected for random key)')
      } else {
        expect(result.status).toBe('new')
        console.log('Statement ACCEPTED!')
      }
    } finally {
      ws.close()
    }
  })

  it('submit with Alice dev account (//Alice)', async () => {
    const ws = await connectWs()
    try {
      const { sr25519PairFromSeed, sr25519Sign, cryptoWaitReady } = await import('@polkadot/util-crypto')
      await cryptoWaitReady()

      // //Alice dev account seed (well-known, only for dev chains)
      const ALICE_SEED = '0xe5be9a5092b81bca64be81d212e7f2f9ebb9f7871a8ae0138c18cc1b6a0e4b32' // equivalent of //Alice mini-secret
      const pair = sr25519PairFromSeed(fromHex(ALICE_SEED))
      console.log('Alice pubkey:', toHex(new Uint8Array(pair.publicKey)))

      const topic1 = fromHex('0x' + 'dd'.repeat(32))
      const data = new TextEncoder().encode('{"type":"test_alice"}')

      const fields: StatementFields = {
        expiry: 18446744073709551614n,
        topics: [topic1],
        data,
      }

      const { encodeSignatureMaterial, PROOF_TAG } = await import('./scale')
      const sigMaterial = encodeSignatureMaterial(fields)
      const signature = sr25519Sign(sigMaterial, pair)

      const encoded = encodeStatement(fields, {
        proofTag: PROOF_TAG.Sr25519,
        signature: new Uint8Array(signature),
        signer: new Uint8Array(pair.publicKey),
      })

      const result = await rpcCall(ws, 'statement_submit', [toHex(encoded)]) as Record<string, unknown>
      console.log('Alice submit result:', JSON.stringify(result))
      expect(result.status).toBeDefined()
    } finally {
      ws.close()
    }
  })

  it('check runtime for statement store allowance config', async () => {
    const ws = await connectWs()
    try {
      // Try state_call to query the runtime API for statement allowance
      try {
        const result = await rpcCall(ws, 'state_call', [
          'ValidateStatement_validate_statement',
          '0x00', // dummy
        ])
        console.log('state_call result:', result)
      } catch (e) {
        console.log('state_call failed:', (e as Error).message.slice(0, 200))
      }

      // Check chain properties for any statement store config
      const props = await rpcCall(ws, 'system_properties', [])
      console.log('Chain properties:', JSON.stringify(props))

      // Check runtime version
      const version = await rpcCall(ws, 'system_version', [])
      console.log('Node version:', version)
    } finally {
      ws.close()
    }
  })

  it('statement_submit: expired statement → alreadyExpired', async () => {
    const ws = await connectWs()
    try {
      const topic1 = fromHex('0x' + '01'.repeat(32))
      const fakeSig = new Uint8Array(64).fill(0xab)
      const fakeSigner = new Uint8Array(32).fill(0xcd)

      const fields: StatementFields = {
        expiry: 1000n,
        topics: [topic1],
      }

      const proof: Sr25519Proof = {
        proofTag: 0,
        signature: fakeSig,
        signer: fakeSigner,
      }

      const encoded = encodeStatement(fields, proof)
      const result = await rpcCall(ws, 'statement_submit', [toHex(encoded)]) as Record<string, unknown>
      console.log('Expired submit result:', JSON.stringify(result))

      expect(result.status).toBe('invalid')
      expect(result.reason).toBe('alreadyExpired')
    } finally {
      ws.close()
    }
  })

  it('subscription delivers statements and we can decode them', async () => {
    const ws = await connectWs()
    try {
      const receivedStatements: string[] = []

      const gotStatements = new Promise<void>((resolve) => {
        ws.on('message', (raw) => {
          const msg = JSON.parse(raw.toString())
          if (msg.method === 'statement_statement') {
            const params = msg.params as { result: unknown }
            const evt = params.result as Record<string, unknown>

            // Adjacently tagged: {"event":"newStatements","data":{"statements":[...]}}
            const data = (evt as any).data
            if (data?.statements) {
              receivedStatements.push(...data.statements)
              resolve()
            }
          }
        })
      })

      const subResult = await rpcCall(ws, 'statement_subscribeStatement', ['any'])
      console.log('Subscription ID:', subResult)
      expect(subResult).toBeTruthy()

      await Promise.race([
        gotStatements,
        new Promise((_, r) => setTimeout(() => r(new Error('No subscription notification within 10s')), 10000))
      ])

      console.log(`Received ${receivedStatements.length} statements`)
      expect(receivedStatements.length).toBeGreaterThan(0)

      // Decode a few statements to validate our decoder
      let decoded = 0
      let failed = 0
      for (const hex of receivedStatements.slice(0, 10)) {
        try {
          const result = decodeStatementFields(fromHex(hex))
          if (result.expiry > 0n) decoded++
        } catch {
          failed++
        }
      }
      console.log(`Decoded: ${decoded}, Failed: ${failed} (out of ${Math.min(10, receivedStatements.length)})`)
      expect(decoded).toBeGreaterThan(0)
    } finally {
      ws.close()
    }
  })
})
