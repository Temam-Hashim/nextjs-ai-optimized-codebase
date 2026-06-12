import { type NextRequest, NextResponse } from "next/server";

import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { getLogger } from "@/core/logging";
import { createClient } from "@/core/supabase/server";
import { ensurePublicUser } from "@/features/auth/sync-user";
import {
  CreateCropSchema,
  createCrop,
  CropFilterSchema,
  getCropCount,
  getCropsByOwner,
} from "@/features/crops";
import { createPaginatedResponse, PaginationParamsSchema } from "@/shared/schemas/pagination";

const logger = getLogger("api.crops");

/**
 * GET /api/crops
 * List crops for the authenticated user. Optional ?cropType=vegetables filter.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const paginationResult = PaginationParamsSchema.safeParse({
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
    });

    let pagination: { page: number; pageSize: number };
    if (paginationResult.success) {
      pagination = paginationResult.data;
    } else {
      pagination = { page: 1, pageSize: 20 };
    }

    const filterResult = CropFilterSchema.safeParse({
      cropType: searchParams.get("cropType") ?? undefined,
    });
    const filter = filterResult.success ? filterResult.data : undefined;

    logger.info({ userId: user.id, filter, pagination }, "crops.list_started");

    const [cropList, total] = await Promise.all([
      getCropsByOwner(user.id, filter),
      getCropCount(user.id, filter),
    ]);

    const start = (pagination.page - 1) * pagination.pageSize;
    const paginatedCrops = cropList.slice(start, start + pagination.pageSize);

    logger.info({ userId: user.id, count: paginatedCrops.length }, "crops.list_completed");

    return NextResponse.json(createPaginatedResponse(paginatedCrops, total, pagination));
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/crops
 * Create a new crop for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
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
    const input = CreateCropSchema.parse(body);

    logger.info({ userId: user.id, name: input.name }, "crops.create_started");

    const crop = await createCrop(input, user.id);

    logger.info({ userId: user.id, cropId: crop.id }, "crops.create_completed");

    return NextResponse.json(crop, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
