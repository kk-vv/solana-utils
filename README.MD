### Solana wallet account utils

- Generate mnemonic with bip39
- Derive account by path under bip44
- Sign message
- Transfer SOL
- Transfer SPL token
- Extension by yourself

### RUN

```
npm install
npm run start
```

### Usage

```
const mnemonic = Bip39Utils.generateMnemonic(12)
const account1 = await SolanaWalletUtils.addressBy(mnemonic)
const privateKey1 = await SolanaWalletUtils.privateKey(mnemonic)
const account2 = await SolanaWalletUtils.addressBy(mnemonic, 1)
const privateKey2 = await SolanaWalletUtils.privateKey(mnemonic, 1)
const signMessage = await SolanaWalletUtils.signMessage('Hello message', mnemonic)
console.log('mnemonic:', mnemonic)
console.log('account1:', account1)
console.log('privateKey1:', privateKey1)
console.log('account2:', account2)
console.log('privateKey2:', privateKey2)
console.log('sign [Hello message]:', signMessage)
```

### Transfer

#### Fulfill mnemonic in `config.ts`

```
export const mnemonic = 'your mnemonic here'
```

#### Send SOL

```
npm run dispatch-sol
```

#### Send SPL Token

```
npm run dispatch-spl
```