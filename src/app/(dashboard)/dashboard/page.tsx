import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURE_FLAGS, isFeatureEnabled } from "@/core/feature-flags";
import { createClient } from "@/core/supabase/server";
import { CropSummaryCards } from "@/features/crops/components/crop-summary-cards";
import { HarvestAlerts } from "@/features/crops/components/harvest-alerts";
import { getCropCount } from "@/features/crops";
import { getProjectCount } from "@/features/projects";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const projectCount = user ? await getProjectCount(user.id) : 0;
  const cropCount = user ? await getCropCount(user.id) : 0;
  const buyerViewEnabled = isFeatureEnabled(FEATURE_FLAGS.BUYER_INVENTORY_VIEW);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to Safrico</p>
      </div>

      <HarvestAlerts />
      <CropSummaryCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="font-medium">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">User ID</dt>
                <dd className="font-mono text-sm">{user?.id}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Last Sign In</dt>
                <dd className="text-sm">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crops</CardTitle>
            <CardDescription>Your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {cropCount > 0
                ? `You have ${cropCount} crop${cropCount === 1 ? "" : "s"} in stock.`
                : "No crops yet."}
            </p>
            <a
              href="/dashboard/crops"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Manage crops &rarr;
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Your projects</CardDescription>
          </CardHeader>
          <CardContent>
            {projectCount > 0 ? (
              <p className="text-sm text-muted-foreground">
                You have {projectCount} project{projectCount === 1 ? "" : "s"}.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
            <a
              href="/dashboard/projects"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Manage projects &rarr;
            </a>
          </CardContent>
        </Card>

        {buyerViewEnabled && (
          <Card>
            <CardHeader>
              <CardTitle>Buyer inventory</CardTitle>
              <CardDescription>Public read-only market view</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aggregated totals for buyers — no edit access.
              </p>
              <a
                href="/inventory"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                View market inventory &rarr;
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
