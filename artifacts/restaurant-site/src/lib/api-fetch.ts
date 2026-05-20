import { apiUrl } from "./api-config";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      ...(init?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    const trimmed = text.trim();
    if (trimmed.startsWith("<!") || trimmed.includes("<!DOCTYPE")) {
      throw new Error(
        "API returned HTML instead of JSON. Start the API server (port 3001) or check Vercel deploy and DATABASE_URL.",
      );
    }
    try {
      const json = JSON.parse(trimmed) as { error?: string; message?: string };
      if (json.error) throw new Error(json.error);
      if (json.message) throw new Error(json.message);
    } catch (e) {
      if (e instanceof Error && e.message !== trimmed) throw e;
    }
    throw new Error(trimmed || `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
