// One-time provisioning: grant Statement Store allowance to the game signing account.
// Run: npx tsx scripts/provision-game-account.ts

import { Keyring } from '@polkadot/keyring'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { createClient } from 'polkadot-api'
import { getWsProvider } from 'polkadot-api/ws-provider/node'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { getPolkadotSigner, type PolkadotSigner } from 'polkadot-api/signer'
import { Binary } from 'polkadot-api'

const WS_URL = 'wss://pop3-testnet.parity-lab.parity.io/people'

// The game account — hardcoded in the app
const GAME_ACCOUNT_MNEMONIC = 'fever scan aware kind file build inch rebel crisp like soup clinic'

function createAliceSigner(): PolkadotSigner {
  const keyring = new Keyring({ type: 'sr25519' })
  const alice = keyring.addFromUri('//Alice')

  const baseSigner = getPolkadotSigner(
    new Uint8Array(alice.publicKey),
    'Sr25519',
    async (input: Uint8Array) => new Uint8Array(alice.sign(input))
  )

  return {
    publicKey: baseSigner.publicKey,
    signBytes: baseSigner.signBytes,
    signTx: async (callData, signedExtensions, metadata, atBlockNumber, hasher) => {
      return baseSigner.signTx(callData, {
        ...signedExtensions,
        VerifyMultiSignature: {
          identifier: 'VerifyMultiSignature',
          value: new Uint8Array([1]),
          additionalSigned: new Uint8Array([]),
        },
        AsPerson: {
          identifier: 'AsPerson',
          value: new Uint8Array([0]),
          additionalSigned: new Uint8Array([]),
        },
      }, metadata, atBlockNumber, hasher)
    },
  }
}

async function main() {
  await cryptoWaitReady()

  const keyring = new Keyring({ type: 'sr25519' })
  const gameAccount = keyring.addFromMnemonic(GAME_ACCOUNT_MNEMONIC)
  console.log('Game account address:', gameAccount.address)
  console.log('Game account pubkey:', Buffer.from(gameAccount.publicKey).toString('hex'))

  console.log('Connecting to', WS_URL)
  const provider = getWsProvider(WS_URL)
  const client = createClient(withPolkadotSdkCompat(provider))
  const api = client.getUnsafeApi()

  // Build storage key: :statement-allowance: + pubkey
  const prefix = new TextEncoder().encode(':statement-allowance:')
  const storageKeyBytes = new Uint8Array(prefix.length + gameAccount.publicKey.length)
  storageKeyBytes.set(prefix, 0)
  storageKeyBytes.set(new Uint8Array(gameAccount.publicKey), prefix.length)

  // Allowance value: 20 statements, 20KB
  const allowanceBytes = new Uint8Array(8)
  const view = new DataView(allowanceBytes.buffer)
  view.setUint32(0, 20, true)
  view.setUint32(4, 20480, true)

  const setStorageCall = (api.tx.System as any).set_storage({
    items: [[Binary.fromBytes(storageKeyBytes), Binary.fromBytes(allowanceBytes)]]
  })
  const sudoCall = (api.tx.Sudo as any).sudo({ call: setStorageCall.decodedCall })

  const aliceSigner = createAliceSigner()
  console.log('Submitting Sudo.sudo(System.set_storage) from Alice...')

  await sudoCall.signAndSubmit(aliceSigner)
  console.log('✅ Allowance granted: 20 statements, 20KB')

  client.destroy()
}

main().catch(err => { console.error('❌', err); process.exit(1) })
