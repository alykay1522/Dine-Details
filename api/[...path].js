/**
 * Vercel serverless entry for all /api/* routes.
 * Express app is bundled to ./handler.mjs by `pnpm -C artifacts/api-server build`.
 */
import app from "./handler.mjs";

export default function handler(req, res) {
  const rawUrl = req.url ?? "/";
  req.url = rawUrl.replace(/^\/api(?:\/|$)/, "/") || "/";
  return app(req, res);
}
