import { createEventSchema } from "../src/api/v1/validation/eventValidation";

const futureDate = (): string => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString();
};

describe("Create event validation schema", () => {
    it("should validate a complete valid event", () => {
        const event = {
            name: "Tech Conference 2025",
            date: futureDate(),
            capacity: 200,
            registrationCount: 50,
            status: "active",
            category: "conference",
        };

        const { error, value } = createEventSchema.validate(event);

        expect(error).toBeUndefined();
        expect(value.name).toBe(event.name);
        expect(value.capacity).toBe(200);
        expect(value.registrationCount).toBe(50);
        expect(value.status).toBe("active");
        expect(value.category).toBe("conference");
    });

    it("should apply default values when optional fields are omitted", () => {
        const event = {
            name: "ABC",
            date: futureDate(),
            capacity: 100,
        };

        const { error, value } = createEventSchema.validate(event);

        expect(error).toBeUndefined();
        expect(value.registrationCount).toBe(0);
        expect(value.status).toBe("active");
        expect(value.category).toBe("general");
    });

    it("should require name", () => {
        const event = {
            date: futureDate(),
            capacity: 200,
        };

        const { error } = createEventSchema.validate(event);

        expect(error?.details[0].message).toBe("\"name\" is required");
    });

    it("should reject name shorter than 3 characters", () => {
        const event = {
            name: "AB",
            date: futureDate(),
            capacity: 100,
        };

        const { error } = createEventSchema.validate(event);

        expect(error?.details[0].message).toBe(
            "\"name\" length must be at least 3 characters long"
        );
    });

    it("should reject capacity below 5", () => {
        const event = {
            name: "Small Event",
            date: futureDate(),
            capacity: 4,
        };

        const { error } = createEventSchema.validate(event);

        expect(error?.details[0].message).toBe(
            "\"capacity\" must be greater than or equal to 5"
        );
    });

    it("should allow capacity of 5", () => {
        const event = {
            name: "Small Event",
            date: futureDate(),
            capacity: 5,
        };

        const { error, value } = createEventSchema.validate(event);

        expect(error).toBeUndefined();
        expect(value.capacity).toBe(5);
    });

    it("should reject decimal capacity", () => {
        const event = {
            name: "Test Event",
            date: futureDate(),
            capacity: 50.5,
        };

        const { error } = createEventSchema.validate(event);

        expect(error?.details[0].message).toBe("\"capacity\" must be an integer");
    });

    it("should reject invalid status", () => {
        const event = {
            name: "Test Event",
            date: futureDate(),
            capacity: 100,
            status: "pending",
        };

        const { error } = createEventSchema.validate(event);

        expect(error?.details[0].message).toBe(
            "\"status\" must be one of [active, cancelled, completed]"
        );
    });

    it("should reject invalid category", () => {
        const event = {
            name: "Test Event",
            date: futureDate(),
            capacity: 100,
            category: "party",
        };

        const { error } = createEventSchema.validate(event);

        expect(error?.details[0].message).toBe(
            "\"category\" must be one of [conference, workshop, meetup, seminar, general]"
        );
    });

    it("should reject registrationCount greater than capacity", () => {
        const event = {
            name: "Overbooked Event",
            date: futureDate(),
            capacity: 100,
            registrationCount: 150,
        };

        const { error } = createEventSchema.validate(event);

        expect(error?.details[0].message).toBe(
            "\"registrationCount\" must be less than or equal to ref:capacity"
        );
    });

    it("should allow registrationCount equal to capacity", () => {
        const event = {
            name: "Sold Out Event",
            date: futureDate(),
            capacity: 100,
            registrationCount: 100,
        };

        const { error, value } = createEventSchema.validate(event);

        expect(error).toBeUndefined();
        expect(value.registrationCount).toBe(100);
    });

    it("should reject past dates", () => {
        const event = {
            name: "Past Event",
            date: "2024-12-25T09:00:00.000Z",
            capacity: 100,
        };

        const { error } = createEventSchema.validate(event);

        expect(error?.details[0].message).toBe(
            "\"date\" must be greater than \"now\""
        );
    });
});