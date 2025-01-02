import { Buffer } from "buffer"
import { Keypair, PublicKey } from "@solana/web3.js"
import * as bip39 from "bip39"
import slip10 from 'micro-key-producer/slip10.js'
import nacl from "tweetnacl"
import { decodeUTF8 } from "tweetnacl-util"

export namespace SolanaWalletUtils {

  export async function signMessage(message: string, mnemonic: string, accountIndex: number = 0) {
    const keypair = await keyPairBy(mnemonic, accountIndex)
    const messageBytes = decodeUTF8(message)
    return Buffer.from(nacl.sign.detached(messageBytes, keypair.secretKey)).toString('hex')
  }

  export async function addressBy(mnemonic: string, accountIndex: number = 0) {
    const keypair = await keyPairBy(mnemonic, accountIndex)
    return keypair.publicKey.toBase58()
  }

  export async function privateKey(mnemonic: string, accountIndex: number = 0) {
    const keypair = await keyPairBy(mnemonic, accountIndex)
    return Buffer.from(keypair.secretKey).toString("hex")
  }

  export async function keyPairBy(mnemonic: string, accountIndex: number = 0) {
    const path = `m/44'/501'/${accountIndex}'/0'`
    const seed = await bip39.mnemonicToSeed(mnemonic, "")
    const hd = slip10.fromMasterSeed(seed)
    const keypair = Keypair.fromSeed(hd.derive(path).privateKey)
    // const keypair = Keypair.fromSeed(seed.slice(0, 32))
    return keypair
  }

  export function isValidAddress(address: string) {
    try {
      const key = new PublicKey(address)
      return PublicKey.isOnCurve(key.toBytes())
    } catch {
      return false
    }
  }
}