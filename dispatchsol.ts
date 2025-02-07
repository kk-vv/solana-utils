import { mnemonic } from "./config"
import { SolanaWalletUtils } from "./utils/solanautils"
import { SolanaTransactionUtils } from "./utils/transferutils"

async function main() {
  const from = await SolanaWalletUtils.keyPairBy(mnemonic)
  const to = [
    'GQUcpeAgeiBNKWvPCcG2SBEcrXRs9RYbXUjSZnNbkNg3',
  ]
  try {
    const txHash = await SolanaTransactionUtils.transferSOLWithAmount('0.005', from, to)
    console.log(txHash)
  } catch (error) {
    console.log('Error:', error.message)
  }

}

main()