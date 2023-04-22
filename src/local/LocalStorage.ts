import { IStorage, StoreDataRead } from '../BlockchainNetwork';
import { Block } from '../Block';

export class LocalStorage implements IStorage {
    filePath: string;
    firstIndexAvailable: number;
    lastIndexAvailable:number;
    chunkSizeRead:number;

    constructor(filePath: string) {
        this.firstIndexAvailable = 0;
        this.lastIndexAvailable = 0;
        this.filePath = filePath;
        this.chunkSizeRead = 42;
        this.startLocalStorage();
    }

    private startLocalStorage(){
        // check file path and prepare everything to read the blockchain
    }

    public getLastBlock(): Promise<Block> {

    }

    // Implement local file reading logic and read chunk size in the data and return with next function
    public async read(): Promise<StoreDataRead> {

    }

    public async getOneByIndex(index:number):Promise<Block>{
        // code here to read a specific index
    }

    // write on the localStorage
    public async publish(block: Block){

    }

    // function to resolve and copy a better storage
    public resolve(other:IStorage){
        // code here
    }
}