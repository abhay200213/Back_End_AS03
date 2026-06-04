import Joi from "joi";

export const createEventSchema = Joi.object({
    name: Joi.string().min(3).required(),

    date: Joi.date().iso().greater("now").required(),

    capacity: Joi.number().integer().min(5).required(),

    registrationCount: Joi.number()
        .integer()
        .min(0)
        .max(Joi.ref("capacity"))
        .default(0),

    status: Joi.string()
        .valid("active", "cancelled", "completed")
        .default("active"),

    category: Joi.string()
        .valid("conference", "workshop", "meetup", "seminar", "general")
        .default("general"),
});