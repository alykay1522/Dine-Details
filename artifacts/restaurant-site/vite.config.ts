import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { appendFileSync } from "node:fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

/** NDJSON debug log at monorepo root (session 70adc8). Dev-only. */
function agentDebugSessionLogPlugin(logPath: string): Plugin {
  return {
    name: "agent-debug-session-log",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url?.split("?")[0] ?? "";
        if (raw.startsWith("/api/")) {
          try {
            appendFileSync(
              logPath,
              `${JSON.stringify({
                sessionId: "70adc8",
                location: "vite:dev:incoming",
                message: "incoming request under /api",
                data: { method: req.method, url: raw },
                timestamp: Date.now(),
                hypothesisId: "H5",
                runId: "post-fix",
              })}\n`,
            );
          } catch {
            /* ignore */
          }
        }
        next();
      });
    },
  };
}

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;
const basePath = process.env.BASE_PATH ?? "/";

/** When true, use local shims so the UI runs with no backend (no real CRUD). Default: real workspace clients. */
const useApiShims = process.env.VITE_USE_API_SHIMS === "true";

const apiOrigin = process.env.VITE_API_ORIGIN?.replace(/\/+$/, "") ?? "";

export default defineConfig({
  base: basePath,
  plugins: [
    agentDebugSessionLogPlugin(
      path.resolve(import.meta.dirname, "..", "..", "debug-70adc8.log"),
    ),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
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
