import * as Bip39 from 'bip39'

export enum MnemonicStrength {
  twelve = 12,
  twentyfour = 24
}


export namespace Bip39Utils {
  export function isValidMnemonic(mnemonic: string | undefined | null) {
    if (mnemonic !== undefined && mnemonic !== null) {
      return Bip39.validateMnemonic(mnemonic)
    }
    return false
  }

  export function generateMnemonic(strength: MnemonicStrength = MnemonicStrength.twelve) {
    return Bip39.generateMnemonic(128 / 12 * strength)
  }

  export function seedBy(mnemonic: string) {
    return Bip39.mnemonicToSeedSync(mnemonic)
  }
}