import { ShdwDrive, StorageAccountInfo } from "@shadow-drive/sdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
declare type Network = "mainnet-beta" | "testnet" | "devnet" | string;
interface SDKProps {
    payer: Keypair;
    username?: string;
    password?: string;
    network: Network;
}
interface CreateDatabaseOptions {
    name: string;
    size: number;
    unit: "KB" | "MB" | "GB";
}
declare class SqlanaStore {
    /**
     * Instantiates a new SqlanaStore instance
     *
     * @remarks
     *
     *
     * @param payer - The payer Keypair to fund the stores and used to create database instance
     * @param username - The username for the database
     * @param password - The password for the database
     * @returns A new SqlanaStore instance
     *
     * @beta
     */
    readonly username: string;
    private readonly payer;
    private readonly password;
    drive: ShdwDrive | null;
    readonly connection: Connection;
    readonly network: Network;
    readonly publicKey: PublicKey;
    private readonly wallet;
    private storageAccount;
    constructor(options: SDKProps);
    getDrive(): Promise<ShdwDrive>;
    /**
     * Initializes the db client
     *
     * @remarks
     *
     *
     * @param dbAccount - The storage account i.e database to initialize the client
     * @returns void
     *
     * @beta
     */
    initClient(dbAccount: string): Promise<void>;
    getDatabases(): Promise<import("@shadow-drive/sdk").StorageAccountResponse[]>;
    getDatabase(dbAccount?: string, dbName?: string): Promise<import("@shadow-drive/sdk").StorageAccountResponse[] | StorageAccountInfo>;
    dropDatabase(dbAccount: PublicKey): Promise<Error | {
        txid: string;
    }>;
    unfuckDropDatabase(dbAccount: PublicKey): Promise<string | Error>;
    /**
     * Creates a new database
     * @param size - The size of the database
     * @remarks 1GB of storage requires 0.25 SHDW tokens
     *
     */
    createDatabase(createDatabaseOptions: CreateDatabaseOptions): Promise<{
        dbName: string;
        txid: string;
    }>;
    createCollection(dbStorageAccount: string, collectionId?: string): Promise<{
        message: string;
        id: string;
    }>;
    updateCollection(collectionId: string, data: any): Promise<{
        message: string;
        collectionId: string;
    }>;
    getCollection(collectionId: string): Promise<{
        collection: any;
    }>;
    getDocumentIds(collectionId: string): Promise<{
        documentIds: string[];
    }>;
    createDocument(collectionId: string, data: any, documentId?: string): Promise<{
        message: string;
        documentId: string;
    }>;
}
export default SqlanaStore;
