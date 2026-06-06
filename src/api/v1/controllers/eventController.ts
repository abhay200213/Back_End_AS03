import { Request, Response } from "express";
import * as eventService from "../services/eventService";

export const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await eventService.createEvent(req.body);

        res.status(201).json({
            message: "Event created",
            data: event,
        });
    } catch {
        res.status(500).json({
            message: "Failed to create event",
        });
    }
};

export const getAllEvents = async (_req: Request, res: Response): Promise<void> => {
    try {
        const events = await eventService.getAllEvents();

        res.status(200).json({
            message: "Events retrieved",
            count: events.length,
            data: events,
        });
    } catch {
        res.status(500).json({
            message: "Failed to retrieve events",
        });
    }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        const event = await eventService.getEventById(id);

        if (!event) {
            res.status(404).json({
                message: "Event not found",
            });
            return;
        }

        res.status(200).json({
            message: "Event retrieved",
            data: event,
        });
    } catch {
        res.status(500).json({
            message: "Failed to retrieve event",
        });
    }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        const event = await eventService.updateEvent(id, req.body);

        if (!event) {
            res.status(404).json({
                message: "Event not found",
            });
            return;
        }

        res.status(200).json({
            message: "Event updated",
            data: event,
        });
    } catch {
        res.status(500).json({
            message: "Failed to update event",
        });
    }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        const deleted = await eventService.deleteEvent(id);

        if (!deleted) {
            res.status(404).json({
                message: "Event not found",
            });
            return;
        }

        res.status(200).json({
            message: "Event deleted",
        });
    } catch {
        res.status(500).json({
            message: "Failed to delete event",
        });
    }
};