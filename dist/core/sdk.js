"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@project-serum/anchor");
const sdk_1 = require("@shadow-drive/sdk");
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const collection_1 = require("./collection");
const document_1 = require("./document");
const RPCSchema = zod_1.z.union([
    zod_1.z.string().url(),
    zod_1.z.string().refine((s) => ["mainnet-beta", "testnet", "devnet"].includes(s), (e) => ({ message: `Invalid cluster: ${e}` })),
]);
const isURL = (s) => s.startsWith("http");
class SqlanaStore {
    constructor(options) {
        this.password = options.password || "";
        this.username = options.username || "";
        this.payer = options.payer;
        this.publicKey = this.payer.publicKey;
        this.drive = null;
        this.network = RPCSchema.parse(options.network);
        this.connection = new web3_js_1.Connection(isURL(options.network)
            ? options.network
            : (0, web3_js_1.clusterApiUrl)(options.network || "devnet"));
        this.wallet = new anchor_1.Wallet(this.payer);
    }
    getDrive() {
        return __awaiter(this, void 0, void 0, function* () {
            this.drive = yield new sdk_1.ShdwDrive(this.connection, this.wallet).init();
            return this.drive;
        });
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
    initClient(dbAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getDrive();
            this.storageAccount = dbAccount;
        });
    }
    getDatabases() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                throw Error("Drive not initialized");
            try {
                const dbs = yield this.drive.getStorageAccounts("v2");
                return dbs;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getDatabase(dbAccount, dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                throw Error("Drive not initialized");
            if (dbAccount) {
                const db = yield this.drive.getStorageAccount(new web3_js_1.PublicKey(dbAccount));
                return db;
            }
            else {
                const dbs = yield this.getDatabases();
                const db = dbs.filter((db) => db.account.identifier === dbName);
                return db || null;
            }
        });
    }
    dropDatabase(dbAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                return Error("Drive not initialized");
            console.log("Dropping database");
            const { txid } = yield this.drive.deleteStorageAccount(dbAccount, "v2");
            console.log("Database dropped");
            return { txid };
        });
    }
    unfuckDropDatabase(dbAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                return Error("Drive not initialized");
            console.log("Reviving database");
            const { txid } = yield this.drive.cancelDeleteStorageAccount(dbAccount, "v2");
            console.log("Phew! that was a close one. Database retrived");
            return txid;
        });
    }
    /**
     * Creates a new database
     * @param size - The size of the database
     * @remarks 1GB of storage requires 0.25 SHDW tokens
     *
     */
    createDatabase(createDatabaseOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                throw Error(`Drive not initialized! To initialise one call getDrive`);
            // try {
            //   // const dir = mkdirp.sync("/tmp/.store");
            //   console.log("Directory created", dir);
            // } catch (error) {
            //   console.log(error, "error");
            // }
            console.log("Creating database");
            const bucketSize = createDatabaseOptions.size.toString() + createDatabaseOptions.unit;
            try {
                const { shdw_bucket: dbName, transaction_signature: txid } = yield this.drive.createStorageAccount(createDatabaseOptions.name, bucketSize, "v2");
                console.log("Database created");
                return { dbName, txid };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    createCollection(dbStorageAccount, collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                throw Error("Drive not initialized");
            console.log("Creating collection");
            const collection = new collection_1.Collection({
                collectionId,
                drive: this.drive,
                payer: this.payer.publicKey,
                storageAccount: dbStorageAccount,
            });
            const { message, collectionId: id } = yield collection.create();
            return { message, id };
        });
    }
    updateCollection(collectionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                throw Error("Drive not initialized");
            if (!this.storageAccount)
                throw Error("Storage account not initialized");
            console.log("Updating collection");
            const collection = new collection_1.Collection({
                collectionId,
                drive: this.drive,
                payer: this.payer.publicKey,
                storageAccount: this.storageAccount,
            });
            const { message } = yield collection.update(collectionId, data);
            return { message, collectionId };
        });
    }
    getCollection(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                throw Error("Drive not initialized");
            if (!this.storageAccount)
                throw Error("DB Storage account not initialized");
            let col = new collection_1.Collection({
                collectionId,
                drive: this.drive,
                storageAccount: this.storageAccount,
                payer: this.payer.publicKey,
            });
            const { collection } = yield col.fetch(collectionId);
            return { collection };
        });
    }
    getDocumentIds(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                throw Error("Drive not initialized");
            if (!this.storageAccount)
                throw Error("DB Storage account not initialized");
            let col = new collection_1.Collection({
                drive: this.drive,
                storageAccount: this.storageAccount,
                payer: this.payer.publicKey,
                collectionId: collectionId,
            });
            const { collection } = yield col.fetch();
            return { documentIds: Object.keys(collection) };
        });
    }
    createDocument(collectionId, data, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.drive)
                throw Error("Drive not initialized");
            if (!this.storageAccount)
                throw Error("DB Storage account not initialized");
            let { collection: col } = yield this.getCollection(collectionId);
            const doc = yield new document_1.Document({
                documentData: data,
                docId: documentId,
            }).create();
            col[doc.documentId] = doc.documentData;
            const { message } = yield this.updateCollection(collectionId, col);
            return { message, documentId: doc.documentId };
        });
    }
}
exports.default = SqlanaStore;
