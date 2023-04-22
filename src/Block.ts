import crypto from "crypto";
export class Block {
    index: number;
    timestamp: number;
    data: any;
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(index: number, timestamp: number, data: any, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    public calculateHash(): string {
        return crypto
            .createHash("sha256")
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
            .digest("hex");
    }

    public mineBlock(difficulty:number): void {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}