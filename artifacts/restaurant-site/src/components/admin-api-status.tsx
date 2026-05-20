import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { apiUrl, isStaticShimMode } from "@/lib/api-config";

export function AdminApiStatus() {
  const shim = isStaticShimMode();

  const { isLoading, isError, error } = useQuery({
    queryKey: ["admin-api-health"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/healthz"));
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || `API returned ${res.status}`);
      }
      return res.json() as Promise<{ status: string }>;
    },
    enabled: !shim,
    retry: 1,
    staleTime: 60_000,
  });

  if (shim) {
    return (
      <div
        className="mb-6 rounded-lg border px-4 py-3 text-sm"
        style={{ borderColor: "#ff8a3d", background: "rgba(255, 138, 61, 0.12)" }}
      >
        <p className="font-bold text-foreground">Offline mode</p>
        <p className="text-muted-foreground mt-1">
          <code className="text-xs">VITE_USE_API_SHIMS=true</code> is set. Admin saves will not
          reach the server. Remove it in Vercel and redeploy.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin" />
        Checking API connection…
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="mb-6 flex gap-3 rounded-lg border px-4 py-3 text-sm"
        style={{ borderColor: "#ff4444", background: "rgba(255, 68, 68, 0.1)" }}
      >
        <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color: "#ff4444" }} />
        <div>
          <p className="font-bold text-foreground">API not reachable</p>
          <p className="text-muted-foreground mt-1">
            Saves and uploads will fail until the API is reachable. On Vercel set{" "}
            <code className="text-xs">DATABASE_URL</code> and Cloudinary variables (
            <code className="text-xs">CLOUDINARY_CLOUD_NAME</code>,{" "}
            <code className="text-xs">CLOUDINARY_API_KEY</code>,{" "}
            <code className="text-xs">CLOUDINARY_API_SECRET</code>). Locally, run the API on port 3001.
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-mono break-all">
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
