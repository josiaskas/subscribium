import { Block } from './Block';
import { BlockchainNetwork } from './BlockchainNetwork';

export class Blockchain {
    private readonly blockCreationTargetTime: number;
    private readonly blocksForDifficultyAdjustment: number;
    public difficulty: number = 1;
    public blockChainSource: BlockchainNetwork;
    public isOperational: boolean;

    constructor() {
        this.blockCreationTargetTime = 42000; // 42 seconds in milliseconds
        this.blocksForDifficultyAdjustment = 4200; // 4200 blocks
        this.isOperational = false; // false before connexion to data source
        this.blockChainSource = new BlockchainNetwork({
            localFilePath: "testFile.json",
            mainNetworks:[]
        })
    }

    async addBlock(newBlock: Block) {
        this.blockChainSource.updateChainSource();
        const lastBlock = await this.getLatestBlock()
        newBlock.previousHash = lastBlock.hash;
        this.adjustDifficulty();
        newBlock.mineBlock(this.difficulty);
        return this.blockChainSource.publish(newBlock);
    }

    private createGenesisBlock(): Block {
        return new Block(0, Date.now(), "Genesis Block", "42");
    }

    public async getLatestBlock():Promise<Block>{
       return await this.blockChainSource.getLastBlock();
    }
    // return a block depending on it index
    public async getBlock(index:number):Promise<Block>{
        return await this.blockChainSource.getOneByIndex(index);
    }

    // function that adjust difficulty to match requirement
    private async adjustDifficulty(){
        const latestBlock = await this.getLatestBlock();
        if ((latestBlock.index % this.blocksForDifficultyAdjustment === 0) && (latestBlock.index !== 0)) {
            const timeTaken = await this.calculateTimeTakenForLastNDifficultyAdjustments();
            if (timeTaken < (this.blockCreationTargetTime * this.blocksForDifficultyAdjustment)) {
                this.difficulty++;
            } else if (timeTaken > (this.blockCreationTargetTime * this.blocksForDifficultyAdjustment)) {
                this.difficulty--;
            }
        }
    }

    // code to get the las synchronization block
    public async getLastSyncTimeBlock():Promise<Block>{
        // code here
    }

    public async calculateTimeTakenForLastNDifficultyAdjustments(): Promise<number> {
        const latestBlock = await this.getLatestBlock()
        const currentTime = latestBlock.timestamp;
        const previousTime = this.getLastSyncTimeBlock().timestamp
        return currentTime - previousTime;
    }

    public async isChainValid(): Promise<boolean> {
        const latestBlock = await this.getLatestBlock();
        for (let i = 1; i < latestBlock.index; i++) {
            const currentBlock = await this.getBlock(i);
            const previousBlock = await this.getBlock(i - 1);

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}