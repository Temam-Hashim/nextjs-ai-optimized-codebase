import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { db } from "@/core/database/client";
import { users } from "@/core/database/schema";
import { getLogger } from "@/core/logging";
import { createClient } from "@/core/supabase/server";
import { ensurePublicUser } from "@/features/auth/sync-user";

const logger = getLogger("api.users.me");

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return unauthorizedResponse();
    }

    await ensurePublicUser(user.id, user.email);

    const profile = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

    logger.info({ userId: user.id }, "users.me_completed");

    return NextResponse.json({
      auth: {
        id: user.id,
        email: user.email,
        lastSignInAt: user.last_sign_in_at,
      },
      profile: profile[0] ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
