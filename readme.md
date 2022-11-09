# Sqlana Store 🐘

## Introduction

For ages storing data in accounts was a pain. You had to create a new account type for each new data type you wanted to store, you had to pay for each account and it was expensive(something like 9000 bytes = 0.02 sol/0.6 USD). That's where Store. Store leverages the genesys go's network which is cheap and fast(1GB = 0.8 USD) to create NoSQL Db structure of database, collections and documents. Using this sdk you can easily use shadow drive as a db for your dapp.


# Demo
[![Demo video](https://res.cloudinary.com/dev-connect/image/upload/v1667536779/img/ezgif.com-gif-makersqlanastore_ln1dpy.gif)](https://www.loom.com/share/33839b24cb49428eb98c253bcb3a83e9)

# TODO

- [x] insert document into collection
- [x] insert collection
- [x] get collection
- [x] update collection
- [x] create database
- [x] list database
- [x] create document
- [ ] get collection with filter
- [ ] get document with filter
- [ ] update document
- [ ] delete collection
- [ ] delete document

# Usage

full docs coming soon

Initialize the SDK

```ts
const client = new SqlanaStore({
  payer,
  network: network, // can be cluster or custom rpc url
});
```

Create new Database

```ts
await client.getDrive(); // initialise shadow drive

const db = await client.createDatabase({
  name: "solana_quotes",
  size: 1,
  unit: "MB",
}); // creates database
```

Once you create a database initialise the client with the database storage account key so it can be accessed

```ts
await client.initClient("7ihYQdkxeWcJEGJwb1wc7mYhJho2bdGE6D7x6RE3Nq4Q");
```

Create new collection

```ts
await client.initClient("7ihYQdkxeWcJEGJwb1wc7mYhJho2bdGE6D7x6RE3Nq4Q"); // initialise client with database key and shadow drive
const collection = await client.createCollection(
  "7ihYQdkxeWcJEGJwb1wc7mYhJho2bdGE6D7x6RE3Nq4Q", // db key, will remove requirement in future
  "quotes"
);
```

Get collection

```ts
await client.initClient("7ihYQdkxeWcJEGJwb1wc7mYhJho2bdGE6D7x6RE3Nq4Q"); // this is a common step you d it only once just adding in here so it doesnt get missed

const { collection } = await client.getCollection("quotes");
```

Create document

```ts
const doc = await client.createDocument("quotes", {
  address,
  quote,
});
```
