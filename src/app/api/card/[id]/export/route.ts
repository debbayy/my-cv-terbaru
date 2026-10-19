import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signPrintToken } from "@/lib/print-token";
import { launchBrowser } from "@/lib/browser";
import { appUrl } from "@/lib/config";
import { errorDetail, forwardSession } from "@/lib/render-session";
import { canDownload, getAccess } from "@/lib/access";
import { getCardTemplate } from "@/lib/card-templates";
import { CARD_H, CARD_W } from "@/lib/card";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const format = req.nextUrl.searchParams.get("format") === "pdf" ? "pdf" : "png";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: card } = await supabase.from("cards").select("id,template_id").eq("id", id).single();
  if (!card) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const tier = getCardTemplate(card.template_id).tier;
  if (!canDownload(tier, await getAccess(supabase, user.id)))
    return NextResponse.json({ error: `${tier}_required`, need: tier }, { status: 402 });

  const url = `${appUrl(req.nextUrl.origin)}/print-card/${id}?token=${encodeURIComponent(signPrintToken(`card:${id}`))}`;
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await forwardSession(page, req, appUrl(req.nextUrl.origin));
    await page.setViewport({ width: CARD_W, height: CARD_H, deviceScaleFactor: 2 });
    const res = await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
    if (!res?.ok()) throw new Error(`print-card ${res?.status()}`);
    await page.evaluate(() => document.fonts.ready);

    let body: Uint8Array;
    if (format === "png") {
      const el = await page.$(".card-canvas");
      if (!el) throw new Error("card-canvas tidak ditemukan");
      body = await el.screenshot({ type: "png" });
    } else {
      body = await page.pdf({ width: `${CARD_W}px`, height: `${CARD_H}px`, printBackground: true, pageRanges: "1", margin: { top: "0", right: "0", bottom: "0", left: "0" } });
    }

    return new NextResponse(Buffer.from(body), {
      headers: {
        "Content-Type": format === "png" ? "image/png" : "application/pdf",
        "Content-Disposition": `attachment; filename="kartu.${format}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[card export]", e);
    return NextResponse.json({ error: "export_failed", detail: errorDetail(e) }, { status: 500 });
  } finally {
    await browser.close();
  }
}
