import { readFileSync } from "node:fs";
import postgres from "postgres";

const env = readFileSync(".env", "utf8");
const dbUrl = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!dbUrl) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const sql = postgres(dbUrl, { prepare: false });
const ownerId = "ffd355fc-1d68-4306-84e0-a66052ab16e7";

try {
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `;
  console.log("TABLES:", tables.map((t) => t.table_name).join(", "));

  const owner = await sql`SELECT id, email FROM users WHERE id = ${ownerId}`;
  console.log("OWNER_IN_PUBLIC_USERS:", owner.length > 0 ? owner[0] : "MISSING");

  try {
    await sql`
      INSERT INTO crops (name, crop_type, quantity, harvest_date, owner_id)
      VALUES ('Test', 'grains', 1, NOW(), ${ownerId})
      RETURNING id
    `;
    console.log("TEST_INSERT: success");
    await sql`DELETE FROM crops WHERE name = 'Test' AND owner_id = ${ownerId}`;
  } catch (insertError) {
    const err = insertError as Error & { code?: string; detail?: string };
    console.log("TEST_INSERT_FAILED:", err.message);
    console.log("CODE:", (insertError as { code?: string }).code);
    console.log("DETAIL:", (insertError as { detail?: string }).detail);
  }
} finally {
  await sql.end();
}
