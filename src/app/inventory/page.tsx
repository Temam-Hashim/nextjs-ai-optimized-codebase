import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURE_FLAGS, isFeatureEnabled } from "@/core/feature-flags";
import { CROP_TYPE_LABELS } from "@/features/crops/labels";
import { getPublicInventorySummary } from "@/features/crops";

export default async function InventoryPage() {
  if (!isFeatureEnabled(FEATURE_FLAGS.BUYER_INVENTORY_VIEW)) {
    notFound();
  }

  const summary = await getPublicInventorySummary();
  const totalKg = summary.reduce((sum, row) => sum + row.totalQuantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <a href="/" className="font-semibold">
            Safrico
          </a>
          <nav className="flex gap-4 text-sm">
            <a href="/login" className="text-muted-foreground hover:text-foreground">
              Farm login
            </a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto flex flex-col gap-6 px-4 py-8">
        <div>
          <Badge variant="secondary" className="mb-2">
            Buyer view · Read only
          </Badge>
          <h1 className="text-3xl font-bold">Market inventory</h1>
          <p className="text-muted-foreground">
            Aggregated crop availability across Safrico farms. No farm or owner details shown.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Total available</CardTitle>
            <CardDescription>Sum across all listed crop types</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalKg.toLocaleString()} kg</p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {summary.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inventory published yet.</p>
          ) : (
            summary.map((row) => (
              <Card key={row.cropType}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{CROP_TYPE_LABELS[row.cropType]}</CardTitle>
                  <CardDescription>
                    {row.cropCount} listing{row.cropCount === 1 ? "" : "s"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{row.totalQuantity.toLocaleString()} kg</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
