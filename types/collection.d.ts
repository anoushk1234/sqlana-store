import { ShdwDrive } from "@shadow-drive/sdk";
import { PublicKey } from "@solana/web3.js";
interface CollectionProps {
    collectionId?: string;
    drive: ShdwDrive;
    storageAccount: string;
    payer: PublicKey;
}
export declare class Collection {
    readonly collectionId: string;
    private readonly storageAccount;
    private readonly drive;
    private readonly payer;
    constructor(collectionProps: CollectionProps);
    create(): Promise<{
        message: string;
        collectionId: string;
    }>;
    fetch(filter?: any): Promise<{
        collection: any;
    }>;
    update(collectionId: string, data: any): Promise<{
        message: string;
    }>;
}
export {};
