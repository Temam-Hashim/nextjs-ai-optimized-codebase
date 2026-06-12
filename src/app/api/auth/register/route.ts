import { type NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/core/api/errors";
import { getLogger } from "@/core/logging";
import { createClient } from "@/core/supabase/server";
import { RegisterBodySchema } from "@/features/auth/api-schemas";
import { ensurePublicUser } from "@/features/auth/sync-user";
import { createErrorResponse } from "@/shared/schemas/errors";

const logger = getLogger("api.auth.register");

export async function POST(request: NextRequest) {
  try {
    const body = RegisterBodySchema.parse(await request.json());
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
    });

    if (error) {
      logger.warn({ error: error.message }, "auth.register_failed");
      return NextResponse.json(createErrorResponse(error.message, "AUTH_ERROR"), { status: 400 });
    }

    if (data.user?.email) {
      await ensurePublicUser(data.user.id, data.user.email);
    }

    logger.info({ userId: data.user?.id }, "auth.register_completed");

    return NextResponse.json(
      {
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
        message: data.session
          ? "Registration successful"
          : "Check your email to confirm your account",
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
