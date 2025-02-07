import { mnemonic } from "./config"
import { SolanaWalletUtils } from "./utils/solanautils"
import { SolanaTransactionUtils } from "./utils/transferutils"

async function main() {
  const from = await SolanaWalletUtils.keyPairBy(mnemonic)
  const to = [
    'GQUcpeAgeiBNKWvPCcG2SBEcrXRs9RYbXUjSZnNbkNg3',
    '4nZeaVR96o4G9fwZ3efT3cGTN3n2kjRUhXqAGMrUnPVt',
    'GB3brArmNaPREG6Cp6YHCuW4uimvPv1VbTu3naiinQi8',
    '2q3EXnRMZx3FBF9nXmb8dMB4MjTQeVudwyj5RKESvzkp'
  ]
  const BONK = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
  const bonkDecimals = 5
  try {
    const txHash = await SolanaTransactionUtils.transferSPLToken(from, to, '100', bonkDecimals, BONK)
    console.log(txHash)
  } catch (error) {
    console.log('Error:', error.message)
  }
}

main()