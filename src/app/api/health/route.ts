import { NextResponse } from "next/server";
import { REQUIRED_ENV } from "@/lib/env";
import { appUrl, SUPABASE_URL } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/** Buka /api/health untuk cek konfigurasi. Hanya menampilkan ✓/✗, bukan nilai rahasia. */
export async function GET() {
  const env = Object.fromEntries(REQUIRED_ENV.map((k) => [k, process.env[k] ? "✓ ada" : "✗ KOSONG"]));

  let database = "dilewati (SUPABASE_SERVICE_ROLE_KEY kosong)";
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
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

  return NextResponse.json({ env, supabase: SUPABASE_URL, appUrl: appUrl(), database, node: process.version }, { headers: { "Cache-Control": "no-store" } });
}
