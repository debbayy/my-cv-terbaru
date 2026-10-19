import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signPrintToken } from "@/lib/print-token";
import { launchBrowser } from "@/lib/browser";
import { getTemplate } from "@/lib/templates";
import { isPro } from "@/lib/plans";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // 1) Cek kepemilikan (RLS: user lain dapat null)
  const { data: cv } = await supabase.from("cvs").select("id,template_id").eq("id", id).single();
  if (!cv) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // 2) Cek status Pro — INI paywall-nya. Jangan pernah dipindah ke client.
  const { data: profile } = await supabase.from("profiles").select("pro_until").eq("id", user.id).single();
  if (!isPro(profile?.pro_until)) return NextResponse.json({ error: "pro_required" }, { status: 402 });

  // 3) Render /print/[id] di Chromium → PDF berbasis teks
  const base = process.env.APP_URL || req.nextUrl.origin;
  const url = `${base}/print/${id}?token=${encodeURIComponent(signPrintToken(id))}`;
  const tpl = getTemplate(cv.template_id);

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    const res = await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
    if (!res?.ok()) throw new Error(`print page ${res?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: tpl.pdfMargin,
      preferCSSPageSize: false,
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CV.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[pdf]", e);
    return NextResponse.json({ error: "pdf_failed" }, { status: 500 });
  } finally {
    await browser.close();
  }
}
