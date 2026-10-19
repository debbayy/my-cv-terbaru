import { NextResponse } from "next/server";
import { REQUIRED_ENV } from "@/lib/env";
import { appUrl, SUPABASE_URL } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { launchBrowser } from "@/lib/browser";

export const dynamic = "force-dynamic";

/** Buka /api/health untuk cek konfigurasi. Hanya menampilkan ✓/✗, bukan nilai rahasia. */
export const maxDuration = 60;

export async function GET(req: Request) {
  const env = Object.fromEntries(REQUIRED_ENV.map((k) => [k, process.env[k] ? "✓ ada" : "✗ KOSONG"]));

  let database = "dilewati (SUPABASE_SERVICE_ROLE_KEY kosong)";
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const db = createAdminClient();
      const checks = await Promise.all(
        ["profiles", "cvs", "payments", "cards"].map(async (t) => {
          const { error } = await db.from(t).select("*", { head: true, count: "exact" }).limit(1);
          return `${t}: ${error ? "✗ " + error.message : "✓"}`;
        }),
      );
      database = checks.join(" | ");
    } catch (e) {
      database = "✗ " + (e instanceof Error ? e.message : String(e));
    }
  }

  // /api/health?pdf=1 → tes nyata: jalankan Chromium dan buat PDF kecil
  let pdf: string | undefined;
  if (new URL(req.url).searchParams.get("pdf") === "1") {
    const t0 = Date.now();
    try {
      const b = await launchBrowser();
      try {
        const p = await b.newPage();
        await p.setContent("<h1>tes pdf</h1>");
        const out = await p.pdf({ format: "A4" });
        pdf = `✓ Chromium jalan, PDF ${out.length} byte, ${Date.now() - t0} ms`;
      } finally {
        await b.close();
      }
    } catch (e) {
      pdf = "✗ " + (e instanceof Error ? e.message : String(e)).slice(0, 300);
    }
  }

  return NextResponse.json({ env, supabase: SUPABASE_URL, appUrl: appUrl(), database, ...(pdf ? { pdf } : {}), node: process.version }, { headers: { "Cache-Control": "no-store" } });
}
