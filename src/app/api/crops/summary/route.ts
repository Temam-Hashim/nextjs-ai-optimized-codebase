import { NextResponse } from "next/server";

import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { getLogger } from "@/core/logging";
import { createClient } from "@/core/supabase/server";
import { getCropSummaryByOwner } from "@/features/crops";

const logger = getLogger("api.crops.summary");

/**
 * GET /api/crops/summary
 * Aggregated quantity by crop type for the authenticated owner.
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

    logger.info({ userId: user.id }, "crops.summary_started");
    const summary = await getCropSummaryByOwner(user.id);
    logger.info({ userId: user.id }, "crops.summary_completed");

    return NextResponse.json({ items: summary });
  } catch (error) {
    return handleApiError(error);
  }
}
