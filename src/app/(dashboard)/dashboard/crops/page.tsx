import { FEATURE_FLAGS, isFeatureEnabled } from "@/core/feature-flags";
import { CropsDashboard } from "@/features/crops/components/crops-dashboard";
import { HarvestAlerts } from "@/features/crops/components/harvest-alerts";

export default function CropsPage() {
  const bulkImportEnabled = isFeatureEnabled(FEATURE_FLAGS.CROP_BULK_IMPORT);

  return (
    <div className="flex flex-col gap-8">
      <HarvestAlerts />
      <CropsDashboard bulkImportEnabled={bulkImportEnabled} />
    </div>
  );
}
