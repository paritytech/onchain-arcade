// Fund the game signing account from Alice on the Individuality Local chain.
// Run: npx tsx scripts/fund-game-account.ts

import { Keyring } from '@polkadot/keyring'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { createClient } from 'polkadot-api'
import { getWsProvider } from 'polkadot-api/ws-provider/node'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { getPolkadotSigner, type PolkadotSigner } from 'polkadot-api/signer'

const WS_URL = 'wss://pop3-testnet.parity-lab.parity.io/people'
const GAME_ACCOUNT = '5CRrFPwQQRofD31MX5RQx5jz6zPLZuJwGUeyuY15oiyyaRaj'

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

  console.log('Connecting to', WS_URL)
  const provider = getWsProvider(WS_URL)
  const client = createClient(withPolkadotSdkCompat(provider))
  const api = client.getUnsafeApi()

  const aliceSigner = createAliceSigner()

  // Transfer 1000 UNIT (12 decimals) to game account
  const amount = 1000n * 10n ** 12n

  console.log(`Transferring ${amount} to ${GAME_ACCOUNT}...`)
  const tx = (api.tx.Balances as any).transfer_keep_alive({
    dest: { type: 'Id', value: GAME_ACCOUNT },
    value: amount,
  })

  await tx.signAndSubmit(aliceSigner)
  console.log('✅ Transfer complete: 1000 UNIT sent to game account')

  client.destroy()
}

main().catch(err => { console.error('❌', err); process.exit(1) })
