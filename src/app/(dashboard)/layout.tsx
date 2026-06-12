import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardShell } from "@/components/safrico/dashboard-shell";
import { FEATURE_FLAGS, isFeatureEnabled } from "@/core/feature-flags";
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

  if (!user?.email) {
    redirect("/login");
  }

  await ensurePublicUser(user.id, user.email);

  return (
    <DashboardShell
      userEmail={user.email}
      signOutAction={signOut}
      buyerInventoryEnabled={isFeatureEnabled(FEATURE_FLAGS.BUYER_INVENTORY_VIEW)}
    >
      {children}
    </DashboardShell>
  );
}
