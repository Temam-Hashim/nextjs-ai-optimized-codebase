import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/core/supabase/server";
import { signOut } from "@/features/auth/actions";
import { ensurePublicUser } from "@/features/auth/sync-user";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.email) {
    await ensurePublicUser(user.id, user.email);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <nav className="flex items-center gap-6">
            <a href="/dashboard" className="font-semibold">
              Safrico
            </a>
            <a href="/dashboard" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </a>
            <a href="/dashboard/crops" className="text-muted-foreground hover:text-foreground">
              Crops
            </a>
            <a
              href="/dashboard/projects"
              className="text-muted-foreground hover:text-foreground"
            >
              Projects
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action={signOut}>
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
