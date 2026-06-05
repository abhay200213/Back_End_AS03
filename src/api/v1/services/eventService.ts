import { db } from "../../../../config/firebaseConfig";
import { CreateEventInput, Event, UpdateEventInput } from "../models/eventModel";

const EVENTS_COLLECTION = "events";

const generateEventId = (): string => {
    const timestamp = Date.now().toString();
    return `evt_${timestamp}`;
};

export const createEvent = async (eventData: CreateEventInput): Promise<Event> => {
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

    await db.collection(EVENTS_COLLECTION).doc(id).set(event);

    return event;
};

export const getAllEvents = async (): Promise<Event[]> => {
    const snapshot = await db.collection(EVENTS_COLLECTION).get();

    return snapshot.docs.map((doc) => doc.data() as Event);
};

export const getEventById = async (id: string): Promise<Event | null> => {
    const doc = await db.collection(EVENTS_COLLECTION).doc(id).get();

    if (!doc.exists) {
        return null;
    }

    return doc.data() as Event;
};

export const updateEvent = async (
    id: string,
    eventData: UpdateEventInput
): Promise<Event | null> => {
    const eventRef = db.collection(EVENTS_COLLECTION).doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
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

    await eventRef.set(updatedEvent);

    return updatedEvent;
};

export const deleteEvent = async (id: string): Promise<boolean> => {
    const eventRef = db.collection(EVENTS_COLLECTION).doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
        return false;
    }

    await eventRef.delete();

    return true;
};