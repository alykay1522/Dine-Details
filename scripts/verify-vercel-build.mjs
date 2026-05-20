import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const handler = path.join(root, "api", "handler.mjs");
const entry = path.join(root, "api", "[...path].js");

try {
  await access(handler);
  await access(entry);
  console.log("[verify-vercel-build] OK: api/handler.mjs and api/[...path].js exist");
} catch {
  console.error(
    "[verify-vercel-build] Missing API bundle. Run: pnpm -C artifacts/api-server build",
  );
  process.exit(1);
}
