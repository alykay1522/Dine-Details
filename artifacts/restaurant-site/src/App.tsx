import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import { reportAgentDebug } from "@/agent-debug";

import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Specials from "@/pages/specials";
import Gallery from "@/pages/gallery";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";

const queryClient = new QueryClient();

// #region agent log
/** H2/H3/H5: routing + post-paint DOM visibility (blank screen triage). */
function BlankDebugProbe() {
  const [loc] = useLocation();

  useEffect(() => {
    const base = String(import.meta.env.BASE_URL ?? "/");
    const path = window.location.pathname;
    reportAgentDebug({
      hypothesisId: "H2",
      location: "BlankDebugProbe:route",
      message: "wouter location vs browser path",
      data: { loc, base, path },
    });
  }, [loc]);

  useEffect(() => {
    let r1 = 0;
    let r2 = 0;
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        const root = document.getElementById("root");
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        reportAgentDebug({
          hypothesisId: "H3",
          location: "BlankDebugProbe:afterPaint",
          message: "dom snapshot",
          data: {
            childCount: root?.childElementCount ?? -1,
            innerTextLen: root?.innerText?.length ?? -1,
            reducedMotion,
          },
        });
      });
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [loc]);

  return null;
}
// #endregion

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/specials" component={Specials} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter
          base={String(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")}
        >
          <BlankDebugProbe />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
