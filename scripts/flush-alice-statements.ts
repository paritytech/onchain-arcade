// Flush Alice's old max-expiry statements by submitting u64::MAX replacements,
// then verify 30-second expiry works.

import WebSocket from 'ws'
import { Keyring } from '@polkadot/keyring'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { encodeSignatureMaterial, encodeStatement, toHex, fromHex, PROOF_TAG } from '../src/lib/scale'

const WS_URL = 'wss://pop3-testnet.parity-lab.parity.io/people'

async function main() {
  await cryptoWaitReady()
  const keyring = new Keyring({ type: 'sr25519' })
  const alice = keyring.addFromUri('//Alice')
  console.log('Alice:', alice.address)

  const ws = new WebSocket(WS_URL)
  await new Promise<void>((r, j) => { ws.on('open', r); ws.on('error', j) })

  async function submit(expiry: bigint, label: string): Promise<string> {
    const topic = fromHex('0x' + 'ff'.repeat(32))
    const data = new TextEncoder().encode(`flush-${label}`)
    const fields = { expiry, topics: [topic], data }
    const sigMaterial = encodeSignatureMaterial(fields)
    const sig = alice.sign(sigMaterial)
    const encoded = encodeStatement(fields, {
      proofTag: PROOF_TAG.Sr25519,
      signature: new Uint8Array(sig),
      signer: new Uint8Array(alice.publicKey),
    })

    const id = Math.random() * 100000 | 0
    ws.send(JSON.stringify({ jsonrpc: '2.0', id, method: 'statement_submit', params: [toHex(encoded)] }))
    return new Promise(resolve => {
      const h = (raw: any) => {
        const m = JSON.parse(raw.toString())
        if (m.id === id) { ws.off('message', h); resolve(m.result?.status || 'error') }
      }
      ws.on('message', h)
    })
  }

  // Phase 1: Flush old statements with u64::MAX
  console.log('Phase 1: Flushing old statements with u64::MAX...')
  for (let i = 0; i < 25; i++) {
    const status = await submit(18446744073709551615n, `max-${i}`)
    process.stdout.write(status === 'new' ? '✓' : status === 'known' ? 'k' : '✗')
  }
  console.log()

  // Phase 2: Test 30-second expiry
  console.log('Phase 2: Testing 30s expiry...')
  const expiry30s = (BigInt(Math.floor(Date.now() / 1000) + 30) << 32n) | 42n
  const status = await submit(expiry30s, 'test-30s')
  console.log('30s expiry result:', status)

  if (status === 'new') {
    console.log('✅ Alice is ready for 30-second expiry statements')
  } else {
    console.log('❌ 30s expiry still rejected — need to wait for u64::MAX statements to fill all slots')
  }

  ws.close()
}

main().catch(console.error)
