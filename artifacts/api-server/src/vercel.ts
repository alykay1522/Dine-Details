/**
 * Express app for Vercel serverless (`api/index.mjs`).
 * Routes mount at `/api` to match the full incoming request path —
 * Vercel passes the original URL (e.g. /api/menu) to the function,
 * so the prefix must be present here.
 */
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

// Global JSON error handler — stops Vercel returning HTML 500 pages
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Internal server error" });
});

export default app;
