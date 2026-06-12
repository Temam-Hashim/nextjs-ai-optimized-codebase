import { readFileSync } from "node:fs";
import postgres from "postgres";

const env = readFileSync(".env", "utf8");
const dbUrl = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!dbUrl) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const sql = postgres(dbUrl, { prepare: false });

try {
  const synced = await sql`
    INSERT INTO public.users (id, email)
    SELECT id, email FROM auth.users
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
    RETURNING id, email
  `;
  console.log(`Synced ${synced.length} user(s) from auth.users to public.users`);
  for (const user of synced) {
    console.log(`  - ${user.email} (${user.id})`);
  }

  await sql.unsafe(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.users (id, email)
      VALUES (NEW.id, NEW.email)
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

  await sql.unsafe(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`);

  await sql.unsafe(`
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `);

  console.log("Trigger on_auth_user_created installed");
} catch (error) {
  const err = error as Error;
  console.error("Sync failed:", err.message);
  process.exit(1);
} finally {
  await sql.end();
}
