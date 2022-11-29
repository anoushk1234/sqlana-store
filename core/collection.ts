import { ShadowFile, ShdwDrive } from "@shadow-drive/sdk";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { MD5 } from "crypto-js";
import fs from "fs";
import { SqlanaStore } from "./sdk";

interface CollectionProps {
  collectionId?: string;
  drive: ShdwDrive;
  storageAccount: string;
  payer: PublicKey;
}

export class Collection {
  public readonly collectionId;
  private readonly storageAccount;
  private readonly drive;
  private readonly payer;
  // private collectionFile: any;
  constructor(collectionProps: CollectionProps) {
    if (collectionProps.collectionId) {
      this.collectionId = collectionProps.collectionId;
    } else {
      this.collectionId = MD5((Math.random() * 1000).toString()).toString();
    }
    this.drive = collectionProps.drive;
    this.payer = collectionProps.payer;
    this.storageAccount = new PublicKey(collectionProps.storageAccount);
  }
  async create() {
    try {
      fs.writeFileSync(`/tmp/${this.collectionId}.json`, JSON.stringify({}));
      const uploadFile: ShadowFile = {
        name: `${this.collectionId}.json`,
        file: fs.readFileSync(`/tmp/${this.collectionId}.json`),
      };
      console.log("uploading file", uploadFile);
      const { message } = await this.drive.uploadFile(
        this.storageAccount,
        uploadFile,
        "v2"
      );
      console.log(message);
      return { message, collectionId: this.collectionId };
    } catch (e) {
      console.log(e);
      return { message: (e as Error).message, collectionId: this.collectionId };
    }
  }
  async fetch(filter?: any) {
    try {
      const { data: collection } = await axios.get(
        `https://shdw-drive.genesysgo.net/${this.storageAccount.toString()}/${
          this.collectionId
        }.json`
      );
      console.log(
        "collection fetched",
        `https://shdw-drive.genesysgo.net/${this.storageAccount.toString()}/${
          this.collectionId
        }.json`,
        collection
      );
      return { collection: collection };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async update(collectionId: string, data: any) {
    fs.writeFileSync(`/tmp/${this.collectionId}.json`, JSON.stringify(data));
    const file: ShadowFile = {
      name: `${this.collectionId}.json`,
      file: fs.readFileSync(`/tmp/${this.collectionId}.json`),
    };
    console.log("uploading file", file, collectionId);
    const res = await this.drive.editFile(
      this.storageAccount,
      `https://shdw-drive.genesysgo.net/${this.storageAccount.toBase58()}/${collectionId}.json`,
      file,
      "v2"
    );
    return { message: res.message };
  }
}
