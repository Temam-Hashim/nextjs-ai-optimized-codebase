import { NextResponse } from "next/server";

import { getLogger } from "@/core/logging";
import { createClient } from "@/core/supabase/server";

const logger = getLogger("api.auth.logout");

export async function POST() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    logger.warn({ error: error.message }, "auth.logout_failed");
  } else {
    logger.info("auth.logout_completed");
  }

  return NextResponse.json({ message: "Signed out" });
}
