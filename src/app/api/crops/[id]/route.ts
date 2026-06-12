import { type NextRequest, NextResponse } from "next/server";

import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { getLogger } from "@/core/logging";
import { createClient } from "@/core/supabase/server";
import { deleteCrop, getCrop, UpdateCropSchema, updateCrop } from "@/features/crops";

const logger = getLogger("api.crops");

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/crops/[id]
 * Get a single crop by ID. Owner only.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    logger.info({ cropId: id, userId: user.id }, "crop.get_started");

    const crop = await getCrop(id, user.id);

    logger.info({ cropId: id }, "crop.get_completed");

    return NextResponse.json(crop);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/crops/[id]
 * Update a crop. Owner only.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const input = UpdateCropSchema.parse(body);

    logger.info({ cropId: id, userId: user.id }, "crop.update_started");

    const crop = await updateCrop(id, input, user.id);

    logger.info({ cropId: id, userId: user.id }, "crop.update_completed");

    return NextResponse.json(crop);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/crops/[id]
 * Delete a crop. Owner only.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    logger.info({ cropId: id, userId: user.id }, "crop.delete_started");

    await deleteCrop(id, user.id);

    logger.info({ cropId: id, userId: user.id }, "crop.delete_completed");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
