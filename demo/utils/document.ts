import { PublicKey } from "@solana/web3.js";
import { MD5 } from "crypto-js";

interface DocumentProps {
  docId?: string;
  documentData: string;
}
export class Document {
  public readonly docId;
  public readonly documentData;
  constructor(documentProps: DocumentProps) {
    if (documentProps.docId) {
      this.docId = documentProps.docId;
    } else {
      this.docId = MD5((Math.random() * 1000).toString()).toString();
    }
    this.documentData = documentProps.documentData;
  }
  async create() {
    return { documentId: this.docId, documentData: this.documentData };
  }
}
