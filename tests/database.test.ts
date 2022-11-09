import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { Keypair, PublicKey } from "@solana/web3.js";
import "jest";
import { SqlanaStore } from "../core/sdk";
import fs from "fs";
import { ShadowFile } from "@shadow-drive/sdk";
describe("Database", () => {
  const payer = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(process.env.WALLET!))
  );
  const network = process.env.NETWORK!;
  const sqlana = new SqlanaStore({
    payer,
    network: network,
  });
  it.skip("should initialise the drive(only for creating db)", async () => {
    await sqlana.getDrive();
  });
  it("should initialise the client", async () => {
    await sqlana.initClient("Efcdmkwimeusq767Xwm2hKxYWXWrMsCzbrhbdgNW8HEi");
  });
  it.skip("can create a database", async () => {
    const { dbName, txid } = await sqlana.createDatabase({
      name: "random1",
      size: 1,
      unit: "KB",
    });
    console.log(
      `Database: ${dbName} explorer: https://explorer.solana.com/tx/${txid}`
    );
  });
  it("can get a database", async () => {
    // await sqlana.getDrive();
    const db = await sqlana.getDatabase(
      "Efcdmkwimeusq767Xwm2hKxYWXWrMsCzbrhbdgNW8HEi",
      undefined
    );
    console.log(db);
  });
  it("can get Databases", async () => {
    // await sqlana.getDrive();
    const db = await sqlana.getDatabases();
    console.log("owner: ", db[1].account.owner1.toBase58());
  });
  it.skip("can create a collection", async () => {
    const db = await sqlana.getDatabases();
    // console.log(db.map((d) => d.account..toBase58()));
    const col = await sqlana.createCollection(
      "Efcdmkwimeusq767Xwm2hKxYWXWrMsCzbrhbdgNW8HEi",
      "test_collection"
    );
    console.log(col);
  });
  it("can get a collection", async () => {
    const { collection } = await sqlana.getCollection("test_collection");
    console.log(collection, "it can get a collection");
    expect(collection).toBeDefined();
    // expect(Object.keys(collection)).toEqual(0);
  });
  it.skip("can create a document", async () => {
    const { documentId, message } = await sqlana.createDocument(
      "test_collection",
      {
        post_id: 1,
        title: "My first Article",
        content: "This is my first article",
        author: "anoushk.sol",
      }
    );
    console.log(documentId, message, "it can create a document");
  });
  it("can get a collection", async () => {
    const { collection } = await sqlana.getCollection("test_collection");
    console.log(collection, "it can get a collection with the added document");
    expect(collection).toBeDefined();
    expect(Object.keys(collection).length).toBeGreaterThan(0);
    const { documentIds } = await sqlana.getDocumentIds("test_collection");
    expect(collection[documentIds[0]].post_id).toEqual(1);
    expect(collection[documentIds[0]].title).toEqual("My first Article");
  });
});
