import { Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { reportAgentDebug } from "./agent-debug";

// #region agent log
/** H1 / H1b: errors that never reach AppErrorBoundary (async, non-React). */
window.addEventListener("error", (ev) => {
  const t = ev.target;
  if (
    t &&
    t !== window &&
    t instanceof HTMLElement &&
    ("src" in t || "href" in t)
  ) {
    return;
  }
  reportAgentDebug({
    location: "window.error",
    message: ev.message || "window.error",
    data: {
      filename: ev.filename,
      lineno: ev.lineno,
      colno: ev.colno,
      err: ev.error ? String(ev.error) : null,
    },
    hypothesisId: "H1",
  });
});

window.addEventListener("unhandledrejection", (ev) => {
  reportAgentDebug({
    location: "unhandledrejection",
    message: "unhandledrejection",
    data: { reason: String(ev.reason) },
    hypothesisId: "H1b",
  });
});

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
            The page crashed. Refresh to try again.
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
