import { appUrl } from "@/lib/config";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signPrintToken } from "@/lib/print-token";
import { launchBrowser } from "@/lib/browser";
import { getTemplate } from "@/lib/templates";
import { canDownload, canUseFree, getAccess } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";

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

  // 2) Cek paket: template Pro butuh Pro/Pro Max, template Pro Max butuh Pro Max. INI paywall-nya.
  const tpl0 = getTemplate(cv.template_id);
  const tier = tpl0.tier;
  const access = await getAccess(supabase, user.id);
  let usingFree = false;
  if (!canDownload(tier, access)) {
    // Akun gratis: 1x download khusus CV ATS — kuota dipotong atomic di database
    if (canUseFree(tpl0.ats, access)) {
      const { data: ok } = await createAdminClient().rpc("use_free_download", { p_user: user.id, p_limit: 1 });
      usingFree = ok === true;
    }
    if (!usingFree) return NextResponse.json({ error: `${tier}_required`, need: tier }, { status: 402 });
  }

  // 3) Render /print/[id] di Chromium → PDF berbasis teks
  const base = appUrl(req.nextUrl.origin);
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
    // Gagal membuat PDF → kembalikan kuota gratis yang terpakai
    if (usingFree) await createAdminClient().rpc("refund_free_download", { p_user: user.id }).then(() => {}, () => {});
    return NextResponse.json({ error: "pdf_failed" }, { status: 500 });
  } finally {
    await browser.close();
  }
}
