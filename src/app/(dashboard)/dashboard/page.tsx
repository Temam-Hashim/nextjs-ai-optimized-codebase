import { FEATURE_FLAGS, isFeatureEnabled } from "@/core/feature-flags";
import { createClient } from "@/core/supabase/server";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getCropCount } from "@/features/crops";
import { getProjectCount } from "@/features/projects";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const projectCount = user ? await getProjectCount(user.id) : 0;
  const cropCount = user ? await getCropCount(user.id) : 0;

  return (
    <DashboardOverview
      userEmail={user?.email ?? ""}
      userId={user?.id ?? ""}
      lastSignIn={user?.last_sign_in_at ?? null}
      cropCount={cropCount}
      projectCount={projectCount}
      buyerViewEnabled={isFeatureEnabled(FEATURE_FLAGS.BUYER_INVENTORY_VIEW)}
    />
  );
}
