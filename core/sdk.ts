import { Wallet } from "@project-serum/anchor";
import {
  ShdwDrive,
  StorageAccount,
  StorageAccountInfo,
} from "@shadow-drive/sdk";
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import fs from "fs";
import { z } from "zod";
import { MD5 } from "crypto-js";
import mkdirp from "mkdirp";
import { Collection } from "./collection";
import { Document } from "./document";

const RPCSchema = z.union([
  z.string().url(),
  z.string().refine(
    (s) => ["mainnet-beta", "testnet", "devnet"].includes(s),
    (e) => ({ message: `Invalid cluster: ${e}` })
  ),
]);

type Network = any;
function isURL(inp: string) {
  return inp.startsWith("http");
}
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

export class SqlanaStore {
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
  public readonly username;
  private readonly payer;
  private readonly password;
  public drive: ShdwDrive | null;
  public readonly connection;
  public readonly network: Network;
  public readonly publicKey;
  private readonly wallet;
  private storageAccount: string | undefined;
  constructor(options: SDKProps) {
    this.password = options.password || "";
    this.username = options.username || "";
    this.payer = options.payer;
    this.publicKey = this.payer.publicKey;
    this.drive = null;
    this.network = RPCSchema.parse(options.network);
    this.connection = new Connection(
      isURL(options.network)
        ? options.network
        : clusterApiUrl((options.network as Cluster) || "devnet")
    );
    this.wallet = new Wallet(this.payer);
  }

  async getDrive() {
    this.drive = await new ShdwDrive(this.connection, this.wallet).init();
    return this.drive;
  }
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
  async initClient(dbAccount: string) {
    await this.getDrive();
    this.storageAccount = dbAccount;
  }
  async getDatabases() {
    if (!this.drive) throw Error("Drive not initialized");
    try {
      const dbs = await this.drive.getStorageAccounts("v2");
      return dbs;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getDatabase(dbAccount?: string, dbName?: string) {
    if (!this.drive) throw Error("Drive not initialized");
    if (dbAccount) {
      const db = await this.drive.getStorageAccount(new PublicKey(dbAccount));
      return db;
    } else {
      const dbs = await this.getDatabases();
      const db = dbs.filter((db) => db.account.identifier === dbName);
      return db || null;
    }
  }

  async dropDatabase(dbAccount: PublicKey) {
    if (!this.drive) return Error("Drive not initialized");
    console.log("Dropping database");
    const { txid } = await this.drive.deleteStorageAccount(dbAccount, "v2");
    console.log("Database dropped");
    return { txid };
  }
  async unfuckDropDatabase(dbAccount: PublicKey) {
    if (!this.drive) return Error("Drive not initialized");
    console.log("Reviving database");
    const { txid } = await this.drive.cancelDeleteStorageAccount(
      dbAccount,
      "v2"
    );
    console.log("Phew! that was a close one. Database retrived");
    return txid;
  }
  /**
   * Creates a new database
   * @param size - The size of the database
   * @remarks 1GB of storage requires 0.25 SHDW tokens
   *
   */
  async createDatabase(createDatabaseOptions: CreateDatabaseOptions) {
    if (!this.drive)
      throw Error(`Drive not initialized! To initialise one call getDrive`);
    // try {
    //   // const dir = mkdirp.sync("/tmp/.store");
    //   console.log("Directory created", dir);
    // } catch (error) {
    //   console.log(error, "error");
    // }

    console.log("Creating database");
    const bucketSize =
      createDatabaseOptions.size.toString() + createDatabaseOptions.unit;
    try {
      const { shdw_bucket: dbName, transaction_signature: txid } =
        await this.drive.createStorageAccount(
          createDatabaseOptions.name,
          bucketSize,
          "v2"
        );
      console.log("Database created");

      return { dbName, txid };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createCollection(dbStorageAccount: string, collectionId?: string) {
    if (!this.drive) throw Error("Drive not initialized");
    console.log("Creating collection");

    const collection = new Collection({
      collectionId,
      drive: this.drive,
      payer: this.payer.publicKey,
      storageAccount: dbStorageAccount,
    });
    const { message, collectionId: id } = await collection.create();
    return { message, id };
  }
  async updateCollection(collectionId: string, data: any) {
    if (!this.drive) throw Error("Drive not initialized");
    if (!this.storageAccount) throw Error("Storage account not initialized");
    console.log("Updating collection");

    const collection = new Collection({
      collectionId,
      drive: this.drive,
      payer: this.payer.publicKey,
      storageAccount: this.storageAccount,
    });
    const { message } = await collection.update(collectionId, data);
    return { message, collectionId };
  }
  async getCollection(collectionId: string) {
    if (!this.drive) throw Error("Drive not initialized");
    if (!this.storageAccount) throw Error("DB Storage account not initialized");
    let col = new Collection({
      collectionId,
      drive: this.drive,
      storageAccount: this.storageAccount,
      payer: this.payer.publicKey,
    });
    const { collection } = await col.fetch(collectionId);
    return { collection };
  }
  async getDocumentIds(collectionId: string) {
    if (!this.drive) throw Error("Drive not initialized");
    if (!this.storageAccount) throw Error("DB Storage account not initialized");
    let col = new Collection({
      drive: this.drive,
      storageAccount: this.storageAccount,
      payer: this.payer.publicKey,
      collectionId: collectionId,
    });
    const { collection } = await col.fetch();
    return { documentIds: Object.keys(collection) };
  }
  async createDocument(collectionId: string, data: any, documentId?: string) {
    if (!this.drive) throw Error("Drive not initialized");
    if (!this.storageAccount) throw Error("DB Storage account not initialized");
    let { collection: col } = await this.getCollection(collectionId);
    const doc = await new Document({
      documentData: data,
      docId: documentId,
    }).create();
    col[doc.documentId] = doc.documentData;
    const { message } = await this.updateCollection(collectionId, col);
    return { message, documentId: doc.documentId };
  }
}
