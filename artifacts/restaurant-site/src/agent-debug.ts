// #region agent log
const AGENT_DEBUG_INGEST =
  "http://127.0.0.1:7630/ingest/71183431-4a9c-4089-94a2-116cd7d49db1";

export function reportAgentDebug(payload: Record<string, unknown>) {
  const body = JSON.stringify({
    sessionId: "70adc8",
    timestamp: Date.now(),
    runId: "blank-page",
    ...payload,
  });
  console.error("[debug-70adc8]", body);
  void fetch(AGENT_DEBUG_INGEST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "70adc8",
    },
    body,
    keepalive: true,
  }).catch(() => {});
  if (import.meta.env.DEV) {
    void fetch("/__agent-debug-ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}
// #endregion
