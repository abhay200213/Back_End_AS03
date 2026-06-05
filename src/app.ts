import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import eventRoutes from "./api/v1/routes/eventRoutes";
import healthRoutes from "./api/v1/routes/healthRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/events", eventRoutes);

app.use((_req: Request, res: Response): void => {
    res.status(404).json({
        message: "Route not found",
    });
});

export default app;