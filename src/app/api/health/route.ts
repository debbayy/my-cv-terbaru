import { NextResponse } from "next/server";
import { REQUIRED_ENV } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/** Buka /api/health untuk cek konfigurasi. Hanya menampilkan ✓/✗, bukan nilai rahasia. */
export async function GET() {
  const env = Object.fromEntries(REQUIRED_ENV.map((k) => [k, process.env[k] ? "✓ ada" : "✗ KOSONG"]));

  let database = "dilewati (env Supabase kosong)";
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const db = createAdminClient();
      const checks = await Promise.all(
        ["profiles", "cvs", "payments"].map(async (t) => {
          const { error } = await db.from(t).select("*", { head: true, count: "exact" }).limit(1);
          return `${t}: ${error ? "✗ " + error.message : "✓"}`;
        }),
      );
      database = checks.join(" | ");
    } catch (e) {
      database = "✗ " + (e instanceof Error ? e.message : String(e));
    }
  }

  return NextResponse.json({ env, database, node: process.version }, { headers: { "Cache-Control": "no-store" } });
}
