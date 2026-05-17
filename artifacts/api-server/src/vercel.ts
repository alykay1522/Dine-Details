/**
 * Express app for Vercel serverless (`api/index.mjs`).
 * Routes mount at `/` because Vercel already prefixes `/api`.
 */
import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(router);

export default app;
