import { CreateEventInput, Event, UpdateEventInput } from "../models/eventModel";
import {
    createDocument,
    deleteDocument,
    getDocumentById,
    getDocuments,
    updateDocument,
} from "../repositories/firestoreRepository";

const EVENTS_COLLECTION = "events";

const generateEventId = (): string => {
    return `evt_${Date.now()}`;
};

export const createEvent = async (eventData: CreateEventInput): Promise<Event> => {
    try {
        const now = new Date().toISOString();
        const id = generateEventId();

        const event: Event = {
            id,
            name: eventData.name,
            date: new Date(eventData.date).toISOString(),
            capacity: eventData.capacity,
            registrationCount: eventData.registrationCount ?? 0,
            status: eventData.status ?? "active",
            category: eventData.category ?? "general",
            createdAt: now,
            updatedAt: now,
        };

        await createDocument<Event>(EVENTS_COLLECTION, event, id);

        return event;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create event: ${errorMessage}`);
    }
};

export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const snapshot = await getDocuments(EVENTS_COLLECTION);

        return snapshot.docs.map((doc) => doc.data() as Event);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve events: ${errorMessage}`);
    }
};

export const getEventById = async (id: string): Promise<Event | null> => {
    try {
        const doc = await getDocumentById(EVENTS_COLLECTION, id);

        if (!doc) {
            return null;
        }

        return doc.data() as Event;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve event: ${errorMessage}`);
    }
};

export const updateEvent = async (
    id: string,
    eventData: UpdateEventInput
): Promise<Event | null> => {
    try {
        const doc = await getDocumentById(EVENTS_COLLECTION, id);

        if (!doc) {
            return null;
        }

        const existingEvent = doc.data() as Event;
        const now = new Date().toISOString();

        const updatedEvent: Event = {
            ...existingEvent,
            ...eventData,
            date: eventData.date
                ? new Date(eventData.date).toISOString()
                : existingEvent.date,
            updatedAt: now,
        };

        await updateDocument<Event>(EVENTS_COLLECTION, id, updatedEvent);

        return updatedEvent;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update event: ${errorMessage}`);
    }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
    try {
        const doc = await getDocumentById(EVENTS_COLLECTION, id);

        if (!doc) {
            return false;
        }

        await deleteDocument(EVENTS_COLLECTION, id);

        return true;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete event: ${errorMessage}`);
    }
};