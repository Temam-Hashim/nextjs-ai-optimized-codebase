import { db } from "@/core/database/client";
import { users } from "@/core/database/schema";
import { getLogger } from "@/core/logging";

const logger = getLogger("auth.sync-user");

/**
 * Ensure auth.users has a matching row in public.users.
 * Required for foreign keys (crops.owner_id, projects.owner_id).
 */
export async function ensurePublicUser(userId: string, email: string): Promise<void> {
  await db
    .insert(users)
    .values({ id: userId, email })
    .onConflictDoUpdate({
      target: users.id,
      set: { email, updatedAt: new Date() },
    });

  logger.info({ userId }, "auth.user_synced");
}
