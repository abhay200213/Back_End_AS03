import * as eventService from "../src/api/v1/services/eventService";
import {
    createDocument,
    deleteDocument,
    getDocumentById,
    getDocuments,
    updateDocument,
} from "../src/api/v1/repositories/firestoreRepository";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    createDocument: jest.fn(),
    getDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
}));

const mockCreateDocument = createDocument as jest.Mock;
const mockGetDocuments = getDocuments as jest.Mock;
const mockGetDocumentById = getDocumentById as jest.Mock;
const mockUpdateDocument = updateDocument as jest.Mock;
const mockDeleteDocument = deleteDocument as jest.Mock;

describe("Event service Firestore repository integration", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create an event using the repository", async () => {
        // Arrange
        mockCreateDocument.mockResolvedValue("evt_test");

        const input = {
            name: "Abhay Singh Test Event",
            date: new Date(Date.now() + 86400000).toISOString(),
            capacity: 100,
            registrationCount: 10,
            status: "active" as const,
            category: "conference" as const,
        };

        // Act
        const result = await eventService.createEvent(input);

        // Assert
        expect(mockCreateDocument).toHaveBeenCalledTimes(1);
        expect(mockCreateDocument).toHaveBeenCalledWith(
            "events",
            expect.objectContaining({
                name: input.name,
                capacity: input.capacity,
                registrationCount: input.registrationCount,
                status: input.status,
                category: input.category,
            }),
            expect.any(String)
        );
        expect(result.name).toBe(input.name);
    });

    it("should get all events using the repository", async () => {
        // Arrange
        const mockEvents = [
            {
                id: "evt_1",
                name: "Abhay Singh Test Event",
                date: new Date(Date.now() + 86400000).toISOString(),
                capacity: 100,
                registrationCount: 0,
                status: "active",
                category: "general",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];

        mockGetDocuments.mockResolvedValue({
            docs: mockEvents.map((event) => ({
                data: () => event,
            })),
        });

        // Act
        const result = await eventService.getAllEvents();

        // Assert
        expect(mockGetDocuments).toHaveBeenCalledWith("events");
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Abhay Singh Test Event");
    });

    it("should get an event by ID using the repository", async () => {
        // Arrange
        const mockEvent = {
            id: "evt_1",
            name: "Abhay Singh Test Event",
            date: new Date(Date.now() + 86400000).toISOString(),
            capacity: 100,
            registrationCount: 0,
            status: "active",
            category: "general",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        mockGetDocumentById.mockResolvedValue({
            data: () => mockEvent,
        });

        // Act
        const result = await eventService.getEventById("evt_1");

        // Assert
        expect(mockGetDocumentById).toHaveBeenCalledWith("events", "evt_1");
        expect(result?.id).toBe("evt_1");
    });

    it("should update an event using the repository", async () => {
        // Arrange
        const existingEvent = {
            id: "evt_1",
            name: "Old Event",
            date: new Date(Date.now() + 86400000).toISOString(),
            capacity: 100,
            registrationCount: 0,
            status: "active",
            category: "general",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        mockGetDocumentById.mockResolvedValue({
            data: () => existingEvent,
        });
        mockUpdateDocument.mockResolvedValue(undefined);

        // Act
        const result = await eventService.updateEvent("evt_1", {
            name: "Updated Abhay Singh Event",
        });

        // Assert
        expect(mockGetDocumentById).toHaveBeenCalledWith("events", "evt_1");
        expect(mockUpdateDocument).toHaveBeenCalledTimes(1);
        expect(result?.name).toBe("Updated Abhay Singh Event");
    });

    it("should delete an event using the repository", async () => {
        // Arrange
        mockGetDocumentById.mockResolvedValue({
            data: () => ({
                id: "evt_1",
            }),
        });
        mockDeleteDocument.mockResolvedValue(undefined);

        // Act
        const result = await eventService.deleteEvent("evt_1");

        // Assert
        expect(mockGetDocumentById).toHaveBeenCalledWith("events", "evt_1");
        expect(mockDeleteDocument).toHaveBeenCalledWith("events", "evt_1");
        expect(result).toBe(true);
    });
});