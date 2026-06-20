import { ReactNode, useState } from "react";
import {
  Activity,
  Bell,
  CircleHelp,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export type Page = "dashboard" | "chat" | "tracker" | "scan" | "doctors" | "profile" | "settings" | "help";

const navItems: Array<{ id: Page; label: string; icon: ReactNode }> = [
  { id: "dashboard", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { id: "chat", label: "AI Health Chat", icon: <MessageSquare size={16} /> },
  { id: "tracker", label: "Health Tracker", icon: <Activity size={16} /> },
  { id: "scan", label: "Scan & Analyze", icon: <ScanLine size={16} /> },
  { id: "doctors", label: "Find Doctors", icon: <Stethoscope size={16} /> },
  { id: "profile", label: "Patient Profile", icon: <User size={16} /> },
];

interface Props {
  page: Page;
  setPage: (page: Page) => void;
  children: ReactNode;
}

function SidebarContent({ page, setPage, onClose }: Props & { onClose?: () => void }) {
  const { user, logout } = useAuth();

  const navigate = (target: Page) => {
    setPage(target);
    onClose?.();
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-white to-secondary dark:from-slate-950 dark:to-slate-900">
      <div className="flex h-[58px] items-center justify-between border-b border-border px-4 backdrop-blur-sm bg-white/80 dark:bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-emerald-600 shadow-lg">
            <Heart size={16} className="text-white" fill="currentColor" />
          </div>
          <div>
            <span className="block text-[13px] font-bold tracking-tight text-foreground">Evercare AI</span>
            <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Health advisor</span>
          </div>
        </div>
        {onClose && <button onClick={onClose} className="hover:bg-muted rounded-lg p-1 transition-all"><X size={18} /></button>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-2.5 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-muted-foreground/70">Workspace</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[12px] font-medium transition-all duration-300 transform hover:scale-105 ${
              page === item.id 
                ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/30" 
                : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            }`}
          >
            {item.icon}{item.label}
          </button>
        ))}

        <div className="pt-5">
          <p className="px-2.5 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-muted-foreground/70">Support</p>
          <button onClick={() => navigate("settings")} className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[12px] transition-all duration-300 transform hover:scale-105 ${
              page === "settings" 
                ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/30" 
                : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            }`}><Settings size={16} />Settings</button>
          <button onClick={() => navigate("help")} className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[12px] transition-all duration-300 transform hover:scale-105 ${
              page === "help" 
                ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/30" 
                : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            }`}><CircleHelp size={16} />Help center</button>
        </div>
      </nav>

      <div className="border-t border-border px-3 py-3 bg-gradient-to-t from-white to-transparent dark:from-slate-900 dark:to-transparent">
        <div className="mb-1 flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-emerald-600 text-xs font-bold text-white">{user?.name[0]}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold">{user?.name}</p>
            <p className="text-[9px] text-primary">Online</p>
          </div>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-[11px] text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-destructive transition-all duration-300"><LogOut size={15} />Sign out</button>
      </div>
    </div>
  );
}

export default function AppShell({ page, setPage, children }: Props) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitles: Record<Page, string> = {
    dashboard: "Overview",
    chat: "AI Health Chat",
    tracker: "Health Tracker",
    scan: "Scan & Analyze",
    doctors: "Find Doctors",
    profile: "Patient Profile",
    settings: "Settings",
    help: "Help Center",
  };
  const pageTitle = pageTitles[page] ?? "";

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-secondary dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 font-sans">
      <aside className="hidden w-[212px] shrink-0 flex-col border-r border-border bg-white dark:bg-slate-950 lg:flex">
        <SidebarContent page={page} setPage={setPage}>{null}</SidebarContent>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/35 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 flex w-72 flex-col bg-white dark:bg-slate-950 shadow-2xl">
            <SidebarContent page={page} setPage={setPage} onClose={() => setMobileOpen(false)}>{null}</SidebarContent>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-border bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 lg:px-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <button className="text-muted-foreground hover:bg-secondary dark:hover:bg-slate-800 rounded-lg p-1.5 transition-all lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
            <h2 className="text-[16px] font-semibold text-foreground">{pageTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden h-8 w-64 items-center gap-2 rounded-lg border border-border bg-[#fbfcfc] px-3 text-muted-foreground md:flex">
              <Search size={14} /><span className="text-[10px]">Search health records...</span><span className="ml-auto rounded border border-border px-1.5 py-0.5 text-[9px]">Ctrl K</span>
            </div>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-primary"><Bell size={15} /></button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-primary"><Plus size={15} /></button>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{user?.name[0]}</div>
              <span className="text-[11px] font-semibold">{user?.name}</span>
            </div>
            <button onClick={logout} className="p-1.5 text-muted-foreground hover:text-destructive" title="Sign out"><LogOut size={16} /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto"><div className="p-4 pb-2 lg:p-5">{children}</div></main>

        <nav className="flex shrink-0 border-t border-border bg-white lg:hidden">
          {navItems.map((item) => <button key={item.id} onClick={() => setPage(item.id)} className={`flex-1 py-2.5 ${page === item.id ? "text-primary" : "text-muted-foreground"}`}>{item.icon}</button>)}
        </nav>
        <div className="flex shrink-0 items-center justify-center gap-2 border-t border-border bg-white px-4 py-1">
          <ShieldCheck size={11} className="text-primary" />
          <p className="text-center text-[9px] text-muted-foreground">General health information only - not a substitute for professional medical advice.</p>
        </div>
      </div>
    </div>
  );
}
