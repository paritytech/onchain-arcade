import WebSocket from 'ws'
import { Keyring } from '@polkadot/keyring'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { encodeSignatureMaterial, encodeStatement, toHex, fromHex, PROOF_TAG } from '../src/lib/scale'

const WS_URL = 'wss://pop3-testnet.parity-lab.parity.io/people'
const MNEMONIC = 'fever scan aware kind file build inch rebel crisp like soup clinic'

async function main() {
  await cryptoWaitReady()
  const keyring = new Keyring({ type: 'sr25519' })
  const pair = keyring.addFromMnemonic(MNEMONIC)
  console.log('Address:', pair.address)

  const ws = new WebSocket(WS_URL)
  await new Promise<void>((resolve, reject) => {
    ws.on('open', resolve)
    ws.on('error', reject)
  })

  const topic = fromHex('0x' + 'ab'.repeat(32))
  const expiry = (BigInt(Math.floor(Date.now() / 1000) + 30) << 32n) | 0n
  const data = new TextEncoder().encode('{"type":"test_funded_account"}')
  const fields = { expiry, topics: [topic], data }
  const sigMaterial = encodeSignatureMaterial(fields)
  const signature = pair.sign(sigMaterial)
  const encoded = encodeStatement(fields, {
    proofTag: PROOF_TAG.Sr25519,
    signature: new Uint8Array(signature),
    signer: new Uint8Array(pair.publicKey),
  })

  console.log('Submitting with 30s expiry...')

  ws.send(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'statement_submit', params: [toHex(encoded)] }))

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw.toString())
    if (msg.id === 1) {
      console.log('Result:', JSON.stringify(msg.result))
      ws.close()
    }
  })
}

main().catch(console.error)
