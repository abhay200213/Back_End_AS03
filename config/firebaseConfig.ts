export const db = {
    collection: () => {
        throw new Error("Firestore not configured yet");
    },
    doc: () => {
        throw new Error("Firestore not configured yet");
    },
};