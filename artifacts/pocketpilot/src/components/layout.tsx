import React from "react";
import { Link, useLocation } from "wouter";
import { Activity, Wallet, PieChart, User, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Activity, label: "Dashboard" },
    { href: "/transactions", icon: Wallet, label: "Transactions" },
    { href: "/budgets", icon: PieChart, label: "Budgets" },
    { href: "/reports", icon: Activity, label: "Reports" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="flex min-h-[100dvh] w-full bg-background flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-border px-4 md:hidden shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            P
          </div>
          <span className="font-semibold tracking-tight text-lg">PocketPilot</span>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-sidebar md:flex shrink-0">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-sm">
            P
          </div>
          <span className="font-semibold tracking-tight text-lg text-sidebar-foreground">PocketPilot</span>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <div className="mb-4 px-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all cursor-pointer group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80")} />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border mt-auto">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent/50 hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <div className="flex-1 overflow-auto p-4 md:p-8 md:pt-6">
          <div className="mx-auto max-w-5xl w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="flex h-16 items-center justify-around border-t border-border bg-card px-4 md:hidden shrink-0 pb-safe">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
