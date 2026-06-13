import { type NextRequest, NextResponse } from "next/server";

import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { FEATURE_FLAGS, isFeatureEnabled } from "@/core/feature-flags/flags";
import { getLogger } from "@/core/logging";
import { createClient } from "@/core/supabase/server";
import { ensurePublicUser } from "@/features/auth/sync-user";
import { BulkImportSchema, bulkImportCrops } from "@/features/crops";

const logger = getLogger("api.crops.bulk-import");

/**
 * POST /api/crops/bulk-import
 * Import multiple crops from a validated CSV payload. Requires crop-bulk-import flag.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled(FEATURE_FLAGS.CROP_BULK_IMPORT)) {
      return NextResponse.json({ message: "Bulk import is not enabled" }, { status: 403 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    if (user.email) {
      await ensurePublicUser(user.id, user.email);
    }

    const body = await request.json();
    const input = BulkImportSchema.parse(body);

    logger.info({ userId: user.id, count: input.crops.length }, "crops.bulk_import_started");

    const imported = await bulkImportCrops(input.crops, user.id);

    logger.info({ userId: user.id, imported: imported.length }, "crops.bulk_import_completed");

    return NextResponse.json({ imported: imported.length, items: imported }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
