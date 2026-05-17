/** True only when the Vite build explicitly opts into offline shims. */
export function isStaticShimMode(): boolean {
  return import.meta.env.VITE_USE_API_SHIMS === "true";
}

/** Base URL for API requests (empty = same origin). */
export function getApiBase(): string {
  return (import.meta.env.VITE_API_ORIGIN ?? "").replace(/\/+$/, "");
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api${normalized}`;
}
