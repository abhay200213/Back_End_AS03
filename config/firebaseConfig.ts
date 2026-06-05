type FirestoreDocument = {
    set: (data: unknown) => Promise<void>;
    get: () => Promise<{
        exists: boolean;
        data: () => unknown;
    }>;
    delete: () => Promise<void>;
};

type FirestoreCollection = {
    doc: (id: string) => FirestoreDocument;
    get: () => Promise<{
        docs: Array<{
            data: () => unknown;
        }>;
    }>;
};

type FirestoreDb = {
    collection: (name: string) => FirestoreCollection;
};

export const db: FirestoreDb = {
    collection: () => {
        throw new Error("Firestore not configured yet");
    },
};