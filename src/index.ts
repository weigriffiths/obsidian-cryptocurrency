import * as crypto from 'crypto';

// Transfer of funds between two wallets
class Transaction {
  constructor(
    public amount: number, 
    public sender: string, // public key
    public receiver: string, // public key
    public timestamp: number // add timestamp
  ) {}

  toString() {
    return JSON.stringify(this);
  }

  get hash(){
    const str = this.toString()
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');
  }
}

// Individual block on the chain
class Block {
  // A one time use random number
  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string, 
    public transaction: Transaction, 
    public timestamp = Date.now()
  ) {}

  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');
  }
}

// The blockchain
class Chain {
  // Singleton instance
  public static instance = new Chain();
  // Choice of algorithm 'MD5' (128-bit) or 'SHA-256' (slower)
  public algorithm = 'MD5';
  // Choice of difficulty 
  public difficulty = 4;

  public pending: {transaction: Transaction, senderPublicKey: string, signature: Buffer}[] = []

  chain: Block[];

  constructor() {
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
  mine(nonce: number) {
    let solution = 1;
    console.log('⛏️  mining...')

    // Brute force computation creating a hash until a it matches difficulty level
    while(true) {

      const hash = crypto.createHash(this.algorithm);

      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');

      if(attempt.substr(0,4) === Array(this.difficulty + 1).join('0')){
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  // Add transactions to a pending list
  addToPending(transaction: Transaction, senderPublicKey: string, signature: Buffer){
    this.pending.push({transaction: transaction, senderPublicKey: senderPublicKey, signature: signature})
    return this.pending
  }

  // Add a new block to the chain if valid signature & proof of work is complete
  addBlock(pendingTransactions: {transaction: Transaction, senderPublicKey: string, signature: Buffer}[]){
    this.pending.map(e => {
      const verify = crypto.createVerify('SHA256');
      verify.update(e.transaction.toString());

      const isValid = verify.verify(e.senderPublicKey, e.signature);

      if (isValid) {
        const newBlock = new Block(this.lastBlock.hash, e.transaction);
        this.mine(newBlock.nonce);
        this.chain.push(newBlock);
      }
    })
    
  }
  
}
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
  public publicKey: string;
  public privateKey: string;

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
  sendMoney(amount: number, receiverPublicKey: string) {
    const transaction = new Transaction(amount, this.publicKey, receiverPublicKey, Date.now());

    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();

    const signature = sign.sign(this.privateKey); 
    Chain.instance.addToPending(transaction, this.publicKey, signature);
    // Chain.instance.addBlock(transaction, this.publicKey, signature);
  }

}

export {Transaction, Block, Chain, Wallet}