import { ApiError } from "@workspace/api-client-react";

function messageFromApiErrorData(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const rec = data as Record<string, unknown>;
  if (typeof rec.error === "string" && rec.error.trim()) return rec.error;
  if (typeof rec.message === "string" && rec.message.trim()) return rec.message;
  return undefined;
}

/** User-facing message from a failed admin API call. */
export function formatApiError(err: unknown, fallback = "Request failed"): string {
  if (err instanceof ApiError) {
    return messageFromApiErrorData(err.data) ?? err.message;
  }
  if (err instanceof Error && err.message) {
    const msg = err.message.trim();
    if (msg.startsWith("<!") || msg.includes("<!DOCTYPE")) {
      return "API returned HTML instead of JSON. The /api routes may be missing — redeploy with DATABASE_URL set, or run the API locally on port 3001.";
    }
    try {
      const parsed = JSON.parse(msg) as { error?: string; message?: string };
      if (parsed.error) return parsed.error;
      if (parsed.message) return parsed.message;
    } catch {
      /* plain text from apiFetch */
    }
    return err.message;
  }
  return fallback;
}
