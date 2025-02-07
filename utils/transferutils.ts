import { SolanaWalletUtils } from "./solanautils"
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js"

import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token'

const SOLDecimals = 9

export function quantityMultiplyDecimal(quantity: string, decimal: number) {
  const numbers = quantity.split('.')
  if (numbers.length === 2) {
    const head = numbers[0]
    const tail = numbers[1]
    const tailDelta = decimal - tail.length
    if (tailDelta <= 0) {
      return (head + tail.substring(0, decimal)).replace(/^0+/, "")
    } else {
      return (head + tail + '0'.repeat(tailDelta)).replace(/^0+/, "")
    }
  } else {
    return numbers[0] + '0'.repeat(decimal)
  }
}

export type TokenSwapTransactionItem = {
  tokenIn: string,
  tokenInDecimals: number,
  tokenOut: string,
  tokenOutDecimals: number,
  inAmount: string,
  outAmount: string,
  txHash: string
  createTime: number
  commissionWallets: string[]
}

export namespace SolanaTransactionUtils {

  export function setNewComputeUnitLimit(lamports: number) {
    return ComputeBudgetProgram.setComputeUnitLimit({
      units: lamports
    })
  }

  export function addPriorityFee(lamports: number) {
    return ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: lamports
    })
  }

  export function buildSOLTransferInstruction(from: string, to: string, amount: string) {
    return SystemProgram.transfer({
      fromPubkey: new PublicKey(from),
      toPubkey: new PublicKey(to),
      lamports: BigInt(quantityMultiplyDecimal(amount, SOLDecimals))
    })
  }

  export function buildSPLTokenTransferInstruction(fromWallet: PublicKey, fromTokenAccount: PublicKey, toTokenAccount: PublicKey, amount: string, decimals: number) {
    return createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromWallet,
      BigInt(quantityMultiplyDecimal(amount, decimals))
    )
  }

  //Suggest max 20 addresses
  export async function transferSOLWithAmount(
    amount: string,
    from: Keypair,
    to: string[],
    gasLimit: TransactionInstruction | undefined = setNewComputeUnitLimit(500000),
    priorityFee: TransactionInstruction | undefined = addPriorityFee(10 * 5000)
  ): Promise<String> {
    if (to.length == 0) {
      throw new Error('Invalid receipt')
    }
    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')
      const transferTransaction = new Transaction()
      if (gasLimit) {
        transferTransaction.add(gasLimit)
      }
      if (priorityFee) {
        transferTransaction.add(priorityFee)
      }
      for (let i = 0; i < to.length; i++) {
        if (!SolanaWalletUtils.isValidAddress(to[i])) {
          continue
        }
        transferTransaction.add(
          buildSOLTransferInstruction(from.publicKey.toBase58(), to[i], amount)
        )
      }
      const txHash = await sendAndConfirmTransaction(connection, transferTransaction, [from])
      return txHash
    } catch (error) {
      console.error('TransferSOL error:', error)
      throw new Error('Transaction failed.')
    }
  }

  export async function transferSPLToken(
    from: Keypair,
    to: string[],
    amount: string,
    decimals: number,
    mint: String,
    gasLimit: TransactionInstruction | undefined = setNewComputeUnitLimit(500000),
    priorityFee: TransactionInstruction | undefined = addPriorityFee(10 * 5000)
  ): Promise<string> {
    if (to.length == 0) {
      throw new Error('Invalid receipt')
    }
    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        from,
        new PublicKey(mint),
        from.publicKey,
      )

      const transferTransaction = new Transaction()
      if (gasLimit) {
        transferTransaction.add(gasLimit)
      }
      if (priorityFee) {
        transferTransaction.add(priorityFee)
      }
      for (let i = 0; i < to.length; i++) {
        if (!SolanaWalletUtils.isValidAddress(to[i])) {
          continue
        }
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          from,
          new PublicKey(mint),
          new PublicKey(to[i]),
        )
        transferTransaction.add(
          buildSPLTokenTransferInstruction(
            from.publicKey,
            fromTokenAccount.address,
            toTokenAccount.address,
            amount,
            decimals
          )
        )
      }
      const txHash = await sendAndConfirmTransaction(connection, transferTransaction, [from])
      return txHash
    } catch (error) {
      console.error('TransferSPLToken error:', error)
      throw new Error('Transaction failed.')
    }
  }
}
