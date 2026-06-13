"use client";

import {
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Store,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  userEmail: string;
  children: React.ReactNode;
  signOutAction: () => Promise<void>;
  buyerInventoryEnabled?: boolean;
}

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/crops", label: "Crops", icon: Leaf },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
];

export function DashboardShell({
  userEmail,
  children,
  signOutAction,
  buyerInventoryEnabled,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = buyerInventoryEnabled
    ? [...mainNavItems, { href: "/inventory", label: "Market", icon: Store }]
    : mainNavItems;

  const apiDocsActive = pathname === "/api-docs" || pathname.startsWith("/api-docs");

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "safrico-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">Safrico</p>
            <p className="text-xs text-muted-foreground">Agri Intelligence</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {links.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-border p-4">
          <Link
            href="/api-docs"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group flex items-start gap-3 rounded-lg border border-dashed p-3 transition-colors",
              apiDocsActive
                ? "border-primary/60 bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/50",
            )}
          >
            <div
              className={cn(
                "rounded-md border p-1.5 transition-colors",
                apiDocsActive
                  ? "border-primary/30 bg-primary/10"
                  : "border-border bg-card group-hover:border-primary/20",
              )}
            >
              <BookOpen
                className={cn(
                  "h-4 w-4",
                  apiDocsActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-tight">API Docs</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Swagger · OpenAPI</p>
            </div>
          </Link>

          <div className="rounded-lg bg-muted/40 px-3 py-2.5">
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
            <form action={signOutAction} className="mt-2">
              <Button variant="outline" size="sm" type="submit" className="w-full gap-2 bg-card">
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div className="safrico-page-bg flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground lg:hidden">Safrico</p>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
