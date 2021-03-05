"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = exports.Chain = exports.Block = exports.Transaction = void 0;
const crypto = __importStar(require("crypto"));
// Transfer of funds between two wallets
class Transaction {
    constructor(amount, sender, // public key
    receiver, // public key
    timestamp // add timestamp
    ) {
        this.amount = amount;
        this.sender = sender;
        this.receiver = receiver;
        this.timestamp = timestamp;
    }
    toString() {
        return JSON.stringify(this);
    }
    get hash() {
        const str = this.toString();
        const hash = crypto.createHash('SHA256');
        hash.update(str).end();
        return hash.digest('hex');
    }
}
exports.Transaction = Transaction;
// Individual block on the chain
class Block {
    constructor(prevHash, transaction, timestamp = Date.now()) {
        this.prevHash = prevHash;
        this.transaction = transaction;
        this.timestamp = timestamp;
        // A one time use random number
        this.nonce = Math.round(Math.random() * 999999999);
    }
    get hash() {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('SHA256');
        hash.update(str).end();
        return hash.digest('hex');
    }
}
exports.Block = Block;
// The blockchain
class Chain {
    constructor() {
        // Choice of algorithm 'MD5' (128-bit) or 'SHA-256' (slower)
        this.algorithm = 'MD5';
        // Choice of difficulty 
        this.difficulty = 4;
        this.pending = [];
        this.chain = [
            // Genesis block
            new Block('', new Transaction(100, 'genesis', 'satoshi', 1566302400))
        ];
    }
    // Most recent block
    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }
    // Proof of work system
    mine(nonce) {
        let solution = 1;
        console.log('⛏️  mining...');
        // Brute force computation creating a hash until a it matches difficulty level
        while (true) {
            const hash = crypto.createHash(this.algorithm);
            hash.update((nonce + solution).toString()).end();
            const attempt = hash.digest('hex');
            if (attempt.substr(0, 4) === Array(this.difficulty + 1).join('0')) {
                console.log(`Solved: ${solution}`);
                return solution;
            }
            solution += 1;
        }
    }
    // Add transactions to a pending list
    addToPending(transaction, senderPublicKey, signature) {
        this.pending.push({ transaction: transaction, senderPublicKey: senderPublicKey, signature: signature });
        return this.pending;
    }
    // Add a new block to the chain if valid signature & proof of work is complete
    addBlock(pendingTransactions) {
        this.pending.map(e => {
            const verify = crypto.createVerify('SHA256');
            verify.update(e.transaction.toString());
            const isValid = verify.verify(e.senderPublicKey, e.signature);
            if (isValid) {
                const newBlock = new Block(this.lastBlock.hash, e.transaction);
                this.mine(newBlock.nonce);
                this.chain.push(newBlock);
            }
        });
    }
}
exports.Chain = Chain;
// Singleton instance
Chain.instance = new Chain();
// addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
//   const verify = crypto.createVerify('SHA256');
//   verify.update(transaction.toString());
//   const isValid = verify.verify(senderPublicKey, signature);
//   if (isValid) {
//     const newBlock = new Block(this.lastBlock.hash, transaction);
//     this.mine(newBlock.nonce);
//     this.chain.push(newBlock);
//   }
// }
// Wallet gives a user a public/private keypair
class Wallet {
    constructor() {
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
    }
    // Send money by signing transaction
    sendMoney(amount, receiverPublicKey) {
        const transaction = new Transaction(amount, this.publicKey, receiverPublicKey, Date.now());
        const sign = crypto.createSign('SHA256');
        sign.update(transaction.toString()).end();
        const signature = sign.sign(this.privateKey);
        Chain.instance.addToPending(transaction, this.publicKey, signature);
        // Chain.instance.addBlock(transaction, this.publicKey, signature);
    }
}
exports.Wallet = Wallet;
