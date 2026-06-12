import { NextResponse } from "next/server";

import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { getLogger } from "@/core/logging";
import { createClient } from "@/core/supabase/server";
import { getHarvestAlerts } from "@/features/crops";

const logger = getLogger("api.crops.alerts");

/**
 * GET /api/crops/alerts
 * Crops with harvest dates within the next 7 days.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    logger.info({ userId: user.id }, "crops.alerts_started");
    const alerts = await getHarvestAlerts(user.id);
    logger.info({ userId: user.id, count: alerts.length }, "crops.alerts_completed");

    return NextResponse.json({ items: alerts });
  } catch (error) {
    return handleApiError(error);
  }
}
