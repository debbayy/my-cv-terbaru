import { NextResponse, type NextRequest } from "next/server";
import { CARD_H, CARD_W, normalizeCard } from "@/lib/card";
import { getCardTemplate } from "@/lib/card-templates";
import { FREE_MODE, canDownload, getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { renderLive } from "@/lib/render-live";
import { errorDetail } from "@/lib/render-session";

export const runtime = "nodejs";
export const maxDuration = 60;

/** POST { templateId, data, format: "png" | "pdf" } → file kartu langsung dari isian editor. */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > 2_000_000) return NextResponse.json({ error: "too_large" }, { status: 413 });
  let body: { templateId?: string; data?: unknown; format?: string };
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }

  const t = getCardTemplate(String(body.templateId ?? ""));
  const format = body.format === "pdf" ? "pdf" : "png";
  if (!FREE_MODE) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (!canDownload(t.tier, await getAccess(supabase, user.id)))
      return NextResponse.json({ error: `${t.tier}_required`, need: t.tier }, { status: 402 });
  }

  try {
    const out = await renderLive(
      `${req.nextUrl.origin}/print-card/live`,
      { templateId: t.id, data: normalizeCard(body.data, t.defaults) },
      (page) => page.setViewport({ width: CARD_W, height: CARD_H, deviceScaleFactor: 2 }),
      async (page) => {
        if (format === "pdf")
          return page.pdf({ width: `${CARD_W}px`, height: `${CARD_H}px`, printBackground: true, pageRanges: "1", margin: { top: "0", right: "0", bottom: "0", left: "0" } });
        const el = await page.$(".card-canvas");
        if (!el) throw new Error("card-canvas tidak ditemukan");
        return el.screenshot({ type: "png" });
      },
    );
    return new NextResponse(Buffer.from(out), {
      headers: {
        "Content-Type": format === "png" ? "image/png" : "application/pdf",
        "Content-Disposition": `attachment; filename="kartu.${format}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[card render]", e);
    return NextResponse.json({ error: "export_failed", detail: errorDetail(e) }, { status: 500 });
  }
}
