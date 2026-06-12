import { NextResponse } from "next/server";

import { unauthorizedResponse } from "@/core/api/errors";
import { createClient } from "@/core/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return unauthorizedResponse();
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    lastSignInAt: user.last_sign_in_at,
  });
}
