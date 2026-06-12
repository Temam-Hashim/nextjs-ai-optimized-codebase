import { NextResponse } from "next/server";

import { handleApiError } from "@/core/api/errors";
import { FEATURE_FLAGS, isFeatureEnabled } from "@/core/feature-flags";
import { getLogger } from "@/core/logging";
import { getPublicInventorySummary } from "@/features/crops";
import { createErrorResponse } from "@/shared/schemas/errors";

const logger = getLogger("api.inventory.summary");

/**
 * GET /api/inventory/summary
 * Public read-only aggregate inventory by crop type (buyer view).
 * Gated by buyer-inventory-view feature flag.
 */
export async function GET() {
  try {
    if (!isFeatureEnabled(FEATURE_FLAGS.BUYER_INVENTORY_VIEW)) {
      logger.warn("inventory.summary_disabled");
      return NextResponse.json(
        createErrorResponse("Buyer inventory view is not enabled", "FEATURE_DISABLED"),
        { status: 404 },
      );
    }

    logger.info("inventory.summary_started");
    const summary = await getPublicInventorySummary();
    logger.info({ types: summary.length }, "inventory.summary_completed");

    return NextResponse.json({ items: summary });
  } catch (error) {
    return handleApiError(error);
  }
}
