import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Auth from "../pages/Auth";
import AppShell, { Page } from "../components/AppShell";
import Dashboard from "../pages/Dashboard";
import AIChat from "../pages/AIChat";
import HealthTracker from "../pages/HealthTracker";
import ScanAnalyze from "../pages/ScanAnalyze";
import FindDoctors from "../pages/FindDoctors";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import HelpCenter from "../pages/HelpCenter";

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>("dashboard");

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Loading your account...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  const pages: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard />,
    chat: <AIChat />,
    tracker: <HealthTracker />,
    scan: <ScanAnalyze />,
    doctors: <FindDoctors />,
    profile: <Profile />,
    settings: <Settings />,
    help: <HelpCenter />,
  };

  return (
    <AppShell page={page} setPage={setPage}>
      {pages[page]}
    </AppShell>
  );
}

export default function App() {
  return <AppContent />;
}
