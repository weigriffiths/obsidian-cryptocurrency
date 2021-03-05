import {Transaction, Block, Chain, Wallet} from '../src/index'

const satoshi = new Wallet();
const bob = new Wallet();
const alice = new Wallet();

satoshi.sendMoney(50, bob.publicKey);
bob.sendMoney(23, alice.publicKey);
alice.sendMoney(5, bob.publicKey);

console.log(Chain.instance.chain)

const pendingTransactions = Chain.instance.pending

console.log(`Pending Transactions ⏳ : ${JSON.stringify(Object.entries(pendingTransactions))}`)

Chain.instance.addBlock(pendingTransactions)

console.log(`Mined Transactions ⛏️ : ${Chain.instance.chain}`)