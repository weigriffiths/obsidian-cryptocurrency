# Obsidian Cryptocurrency

<h3 align="center">Obsidian</h3>

## Features

* Simple proof-of-work algorithm
* Verify blockchain (to prevent tampering)
* Generate wallet (private/public key)
* Sign transactions

# Usage

```
git clone <this-repo>

npm install
npm start
```

To install as a module in your code, use node:
```
npm install --save github:weigriffiths/obsidian-cryptocurrency
```
To create a new wallet 💰 and get public key:
```
const <account-name> = new Wallet()

const publicKey = <account-name>.publicKey
```
To send money 💵:
```
<account-name>.sendMoney(amount, publicKey)
```
To verify (mine) block ⛏️:
```
const pendingTransactions = Chain.instance.pending

Chain.instance.addBlock(pendingTransactions)
```

# Dev Environment
In dev mode, run the typescript compiler continuously in watch mode to compile automatically to JavaScript. Use the command <code>npm run dev</code>

# Run Tests
You can run tests in the <code>test.ts</code> file. <code>npm run test</code> to initiate.

