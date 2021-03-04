import {Transaction, Block, Chain, Wallet} from '../src/index'

const satoshi = new Wallet()
const bob = new Wallet()

const amount = 200

const sender = satoshi.publicKey
const receiver = bob.publicKey

const transaction = new Transaction(amount, sender, receiver, Date.now());

console.log(`Amount Transacted: ${transaction.amount}`)

console.log(`From: ${sender}`)

console.log(`To: ${receiver}`)

console.log(`Transaction Hash: ${transaction.hash}`)