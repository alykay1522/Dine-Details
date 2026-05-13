import { setBaseUrl } from "../../../lib/api-client-react/src/custom-fetch";

/**
 * Production static hosts serve the SPA from one origin; API lives elsewhere.
 * The generated client uses `/api/...` paths — `setBaseUrl` prepends the API origin.
 * When Vite uses API shims, hooks never call `fetch`; configuring the base URL is harmless.
 */
export function configureApiBaseUrl(): void {
  const origin = import.meta.env.VITE_API_ORIGIN?.trim();
  if (origin) {
    setBaseUrl(origin);
  }
}
