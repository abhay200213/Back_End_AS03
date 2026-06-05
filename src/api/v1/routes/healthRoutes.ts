import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response): void => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

export default router;