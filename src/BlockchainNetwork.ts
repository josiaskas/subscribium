import {Block} from "./Block";
import {LocalStorage} from "./local/LocalStorage";

export interface StoreDataRead {
    data: Block[];
    from: number;
    to: number;
    next: () => Promise<StoreDataRead>;
}

export interface IStorage {
    firstIndexAvailable: number;
    lastIndexAvailable:number;
    read(): Promise<StoreDataRead>;
    getLastBlock():Promise<Block>;
    getOneByIndex(index:number): Promise<Block>;
    publish(block: Block): Promise<void>;
}

export interface NetworkConfig {
    localFilePath: string;
    mainNetworks: string[];
    // other network configs
}

export class BlockchainNetwork {
    private storages: IStorage[];
    private localStore?:IStorage;
    private trustedIndex:number = 0;

    constructor(config:NetworkConfig) {
        this.storages = [];
        this.initLocalNode(config.localFilePath);
        this.initNetworkNodeConnexion(config.mainNetworks);
    }

    private initLocalNode(filePath:string){
        this.localStore = new LocalStorage(filePath);
        this.storages.push(this.localStore);
    }

    private initNetworkNodeConnexion(networksIds:string[]){
        // code to be done later
        for (const networksId of networksIds) {
            // something here, to be done
        }
    }

    public updateChainSource(){
        this.findTrustedOne();
    }

    private findTrustedOne(){
        // select  now the local chain storage for simplicity
        this.trustedIndex = 0;
    }

    // try to publish and write on all the chainStore
    async publish(block: Block){
        try{
            for (const nodeChain of this.storages) {
                await nodeChain.publish(block);
            }
        }catch (e) {
            // not published to all chains
            throw e;
        }
    }

    getOneByIndex(index:number){
        const trustedChain = this.storages[this.trustedIndex];
        if (trustedChain){
            return trustedChain.getOneByIndex(index);
        }
        throw 'No store found';
    }

    getLastBlock():Promise<Block>{
        const trustedChain = this.storages[this.trustedIndex];
        return trustedChain.getLastBlock();
    }

    read():Promise<StoreDataRead>{
        this.updateChainSource();
        const trustedChain = this.storages[this.trustedIndex];
        if (trustedChain){
            return trustedChain.read();
        }
        throw 'No store found';
    }
}