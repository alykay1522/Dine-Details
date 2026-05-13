import { Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// #region agent log
function reportAgentDebug(payload: Record<string, unknown>) {
  const body = JSON.stringify({
    sessionId: "70adc8",
    timestamp: Date.now(),
    runId: "blank-page",
    ...payload,
  });
  console.error("[debug-70adc8]", body);
  if (import.meta.env.DEV) {
    void fetch("/__agent-debug-ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
  fetch("http://127.0.0.1:7630/ingest/71183431-4a9c-4089-94a2-116cd7d49db1", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "70adc8" },
    body,
  }).catch(() => {});
}

if (typeof window !== "undefined") {
  window.addEventListener("error", (ev) => {
    reportAgentDebug({
      location: "window.error",
      message: String(ev.message),
      data: { filename: ev.filename, lineno: ev.lineno, colno: ev.colno },
      hypothesisId: "H3",
    });
  });
  window.addEventListener("unhandledrejection", (ev) => {
    const r = ev.reason;
    reportAgentDebug({
      location: "window.unhandledrejection",
      message: r instanceof Error ? r.message : String(r),
      data: r instanceof Error ? { name: r.name } : {},
      hypothesisId: "H4",
    });
  });
}

class AppErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportAgentDebug({
      location: "AppErrorBoundary:componentDidCatch",
      message: error.message,
      data: {
        name: error.name,
        componentStack: info.componentStack?.slice(0, 1200),
      },
      hypothesisId: "H1",
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            fontFamily: "system-ui, sans-serif",
            maxWidth: 560,
            margin: "48px auto",
          }}
        >
          <h1 style={{ fontSize: 20, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: "#444", marginBottom: 16 }}>
            The page crashed. Refresh to try again. If you are on Admin → Specials, try again
            after this update (invalid category values are now handled).
          </p>
          <pre
            style={{
              fontSize: 13,
              whiteSpace: "pre-wrap",
              background: "#f5f5f5",
              padding: 12,
              borderRadius: 8,
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
// #endregion

const rootEl = document.getElementById("root");
if (!rootEl) {
  document.body.innerHTML =
    "<p style=\"font-family:system-ui;padding:24px\">Missing #root — check index.html.</p>";
} else {
  createRoot(rootEl).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>,
  );
}
