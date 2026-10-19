import { NextResponse, type NextRequest } from "next/server";
import { normalizeCv } from "@/lib/cv";
import { getTemplate } from "@/lib/templates";
import { FREE_MODE, canDownload, getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { renderLive } from "@/lib/render-live";
import { errorDetail } from "@/lib/render-session";

export const runtime = "nodejs";
export const maxDuration = 60;

/** POST { templateId, data } → PDF langsung dari isian editor. Di mode gratis tidak perlu login. */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > 2_000_000) return NextResponse.json({ error: "too_large", detail: "Isian terlalu besar (foto terlalu besar?)" }, { status: 413 });
  let body: { templateId?: string; data?: unknown };
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }

  const tpl = getTemplate(String(body.templateId ?? ""));
  if (!FREE_MODE) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (!canDownload(tpl.tier, await getAccess(supabase, user.id)))
      return NextResponse.json({ error: `${tpl.tier}_required`, need: tpl.tier }, { status: 402 });
  }

  try {
    const pdf = await renderLive(
      `${req.nextUrl.origin}/print/live`,
      { templateId: tpl.id, data: normalizeCv(body.data) },
      async (page) => {
        // Ukur dengan lebar & media yang sama persis dengan kertas cetak, supaya "pas halaman" akurat
        const mm = 96 / 25.4;
        const width = Math.round((210 - parseFloat(tpl.pdfMargin.left) - parseFloat(tpl.pdfMargin.right)) * mm);
        await page.setViewport({ width, height: 1123 });
        await page.emulateMediaType("print");
      },
      (page) => page.pdf({ format: "A4", printBackground: true, margin: tpl.pdfMargin, preferCSSPageSize: false }),
    );
    return new NextResponse(Buffer.from(pdf), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="CV.pdf"', "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("[cv render]", e);
    return NextResponse.json({ error: "pdf_failed", detail: errorDetail(e) }, { status: 500 });
  }
}
