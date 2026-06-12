import { type NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/core/api/errors";
import { getLogger } from "@/core/logging";
import { createClient } from "@/core/supabase/server";
import { LoginBodySchema } from "@/features/auth/api-schemas";
import { ensurePublicUser } from "@/features/auth/sync-user";
import { createErrorResponse } from "@/shared/schemas/errors";

const logger = getLogger("api.auth.login");

export async function POST(request: NextRequest) {
  try {
    const body = LoginBodySchema.parse(await request.json());
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      logger.warn({ error: error.message }, "auth.login_failed");
      return NextResponse.json(createErrorResponse(error.message, "AUTH_ERROR"), { status: 401 });
    }

    if (data.user?.email) {
      await ensurePublicUser(data.user.id, data.user.email);
    }

    logger.info({ userId: data.user?.id }, "auth.login_completed");

    return NextResponse.json({
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      session: data.session
        ? {
            expiresAt: data.session.expires_at,
          }
        : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
