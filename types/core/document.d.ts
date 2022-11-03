interface DocumentProps {
    docId?: string;
    documentData: string;
}
export declare class Document {
    readonly docId: string;
    readonly documentData: string;
    constructor(documentProps: DocumentProps);
    create(): Promise<{
        documentId: string;
        documentData: string;
    }>;
}
export {};
