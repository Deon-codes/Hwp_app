import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { BottomNav, DetailSheet, Header, PlanSheet, ToastNotice } from "./components/escape/EscapeComponents";
import Find from "./pages/Find";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import { EscapeProvider, useEscape } from "./lib/escape-state";
import { ThemeProvider } from "./contexts/ThemeContext";

function EscapeShell() {
  const { view } = useEscape();
  return <div className="escape-app"><Header /><div className="escape-main">{view === "discover" && <Home />}{view === "find" && <Find />}{view === "saved" && <Saved />}{view === "profile" && <Profile />}</div><BottomNav /><DetailSheet /><PlanSheet /><ToastNotice /></div>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><EscapeProvider><EscapeShell /></EscapeProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
