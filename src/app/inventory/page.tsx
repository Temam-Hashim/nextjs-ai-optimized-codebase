import { notFound } from "next/navigation";

import { FEATURE_FLAGS, isFeatureEnabled } from "@/core/feature-flags";
import { InventoryMarketplace } from "@/features/inventory/components/inventory-marketplace";
import { getPublicInventorySummary } from "@/features/crops";

export default async function InventoryPage() {
  if (!isFeatureEnabled(FEATURE_FLAGS.BUYER_INVENTORY_VIEW)) {
    notFound();
  }

  const summary = await getPublicInventorySummary();
  const totalKg = summary.reduce((sum, row) => sum + row.totalQuantity, 0);

  return <InventoryMarketplace summary={summary} totalKg={totalKg} />;
}
