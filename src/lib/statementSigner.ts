// Game signing account for Statement Store submissions.
// A single hardcoded account pre-provisioned with Statement Store allowance
// on the Individuality Local testnet.

import { Keyring } from '@polkadot/keyring'
import { cryptoWaitReady } from '@polkadot/util-crypto'

const GAME_ACCOUNT_MNEMONIC = 'fever scan aware kind file build inch rebel crisp like soup clinic'

let gameKeyPair: ReturnType<Keyring['addFromUri']> | null = null
let initPromise: Promise<void> | null = null

async function ensureReady(): Promise<void> {
  if (gameKeyPair) return
  if (initPromise) return initPromise

  initPromise = (async () => {
    await cryptoWaitReady()
    const keyring = new Keyring({ type: 'sr25519' })
    gameKeyPair = keyring.addFromMnemonic(GAME_ACCOUNT_MNEMONIC)
    console.log('[GameAccount] Ready:', gameKeyPair.address)
  })()

  await initPromise
}

/** Sign raw bytes with the game account's sr25519 key. */
export async function signStatement(data: Uint8Array): Promise<{ signature: Uint8Array; publicKey: Uint8Array }> {
  await ensureReady()
  return {
    signature: new Uint8Array(gameKeyPair!.sign(data)),
    publicKey: new Uint8Array(gameKeyPair!.publicKey),
  }
}
