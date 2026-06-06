import { Router } from "express";
import * as eventController from "../controllers/eventController";
import { validateBody, validateParams } from "../middleware/validateRequest";
import {
    createEventSchema,
    eventIdSchema,
    updateEventSchema,
} from "../validation/eventValidation";

const router = Router();

router.post("/", validateBody(createEventSchema), eventController.createEvent);

router.get("/", eventController.getAllEvents);

router.get(
    "/:id",
    validateParams(eventIdSchema),
    eventController.getEventById
);

router.put(
    "/:id",
    validateParams(eventIdSchema),
    validateBody(updateEventSchema),
    eventController.updateEvent
);

router.delete(
    "/:id",
    validateParams(eventIdSchema),
    eventController.deleteEvent
);

export default router;