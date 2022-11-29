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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = require("crypto-js");
const fs_1 = __importDefault(require("fs"));
class Collection {
    // private collectionFile: any;
    constructor(collectionProps) {
        if (collectionProps.collectionId) {
            this.collectionId = collectionProps.collectionId;
        }
        else {
            this.collectionId = (0, crypto_js_1.MD5)((Math.random() * 1000).toString()).toString();
        }
        this.drive = collectionProps.drive;
        this.payer = collectionProps.payer;
        this.storageAccount = new web3_js_1.PublicKey(collectionProps.storageAccount);
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                fs_1.default.writeFileSync(`/tmp/${this.collectionId}.json`, JSON.stringify({}));
                const uploadFile = {
                    name: `${this.collectionId}.json`,
                    file: fs_1.default.readFileSync(`/tmp/${this.collectionId}.json`),
                };
                console.log("uploading file", uploadFile);
                const { message } = yield this.drive.uploadFile(this.storageAccount, uploadFile, "v2");
                console.log(message);
                return { message, collectionId: this.collectionId };
            }
            catch (e) {
                console.log(e);
                return { message: e.message, collectionId: this.collectionId };
            }
        });
    }
    fetch(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: collection } = yield axios_1.default.get(`https://shdw-drive.genesysgo.net/${this.storageAccount.toString()}/${this.collectionId}.json`);
                console.log("collection fetched", `https://shdw-drive.genesysgo.net/${this.storageAccount.toString()}/${this.collectionId}.json`, collection);
                return { collection: collection };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    update(collectionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.writeFileSync(`/tmp/${this.collectionId}.json`, JSON.stringify(data));
            const file = {
                name: `${this.collectionId}.json`,
                file: fs_1.default.readFileSync(`/tmp/${this.collectionId}.json`),
            };
            console.log("uploading file", file, collectionId);
            const res = yield this.drive.editFile(this.storageAccount, `https://shdw-drive.genesysgo.net/${this.storageAccount.toBase58()}/${collectionId}.json`, file, "v2");
            return { message: res.message };
        });
    }
}
exports.Collection = Collection;
