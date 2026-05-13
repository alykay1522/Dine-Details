import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { appendFileSync } from "node:fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

/** Dev-only: browser POSTs NDJSON here so the workspace `debug-70adc8.log` file is populated. */
function agentDebugIngestPlugin(logPath: string): Plugin {
  return {
    name: "agent-debug-ingest-70adc8",
    apply: "serve",
    configureServer(server) {
      try {
        appendFileSync(
          logPath,
          `${JSON.stringify({
            sessionId: "70adc8",
            timestamp: Date.now(),
            location: "vite:configureServer",
            message: "dev server configureServer ran",
            hypothesisId: "H0",
            runId: "boot",
          })}\n`,
        );
      } catch (err) {
        console.warn("[agent-debug-ingest] could not write startup line:", logPath, err);
      }
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        if (req.method !== "POST" || url !== "/__agent-debug-ingest") {
          next();
          return;
        }
        const chunks: Buffer[] = [];
        req.on("data", (c: Buffer) => chunks.push(c));
        req.on("end", () => {
          try {
            const body = Buffer.concat(chunks).toString("utf8").trim();
            if (body) appendFileSync(logPath, `${body}\n`);
          } catch (err) {
            console.warn("[agent-debug-ingest] append failed:", logPath, err);
          }
          res.statusCode = 204;
          res.end();
        });
        req.on("error", next);
      });
    },
  };
}

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;

/**
 * `?? "/"` is not enough: `BASE_PATH=""` is common in dashboards and would set Vite `base` to "",
 * producing relative asset URLs that break on client-routed paths (e.g. /menu) after a full reload.
 */
function normalizeViteBase(raw: string | undefined): string {
  if (raw === undefined) return "/";
  const t = raw.trim();
  if (t === "" || t === ".") return "/";
  if (t === "./") return "./";
  const abs = t.startsWith("/") ? t : `/${t}`;
  return abs.endsWith("/") ? abs : `${abs}/`;
}

const basePath = normalizeViteBase(process.env.BASE_PATH);

/** When true, use local shims so the UI runs with no backend (no real CRUD). Default: real workspace clients. */
const useApiShims = process.env.VITE_USE_API_SHIMS === "true";

const apiOrigin = process.env.VITE_API_ORIGIN?.replace(/\/+$/, "") ?? "";

const agentDebugLogPath = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "debug-70adc8.log",
);

export default defineConfig({
  base: basePath,
  plugins: [
    agentDebugIngestPlugin(agentDebugLogPath),
    react(),
    tailwindcss(),
    ...(process.env.REPL_ID !== undefined ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      ...(useApiShims
        ? {
            // Static shims: no Express/DB — set VITE_USE_API_SHIMS=true for offline UI only
            "@workspace/api-client-react": path.resolve(
              import.meta.dirname,
              "src/shims/api-client-react.ts",
            ),
            "@workspace/object-storage-web": path.resolve(
              import.meta.dirname,
              "src/shims/object-storage-web.ts",
            ),
          }
        : {}),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    ...(apiOrigin
      ? {
          proxy: {
            "/api": { target: apiOrigin, changeOrigin: true },
          },
        }
      : {}),
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
