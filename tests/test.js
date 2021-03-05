"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const satoshi = new index_1.Wallet();
const bob = new index_1.Wallet();
const alice = new index_1.Wallet();
satoshi.sendMoney(50, bob.publicKey);
bob.sendMoney(23, alice.publicKey);
alice.sendMoney(5, bob.publicKey);
console.log(index_1.Chain.instance.chain);
const pendingTransactions = index_1.Chain.instance.pending;
console.log(`Pending Transactions ⏳ : ${JSON.stringify(Object.entries(pendingTransactions))}`);
index_1.Chain.instance.addBlock(pendingTransactions);
console.log(`Mined Transactions ⛏️ : ${index_1.Chain.instance.chain}`);
