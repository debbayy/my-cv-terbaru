import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyPrintToken } from "@/lib/print-token";
import { normalizeCv } from "@/lib/cv";
import { getTemplate } from "@/lib/templates";
import CvSheet from "@/components/cv/CvSheet";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/**
 * Halaman ini HANYA dibuka oleh Chromium di server (lewat /api/cv/[id]/pdf)
 * dengan token HMAC berumur 60 detik. Tanpa token valid → 404.
 */
export default async function PrintPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  if (!verifyPrintToken(id, token)) notFound();

  const { data: cv } = await (await createClient()).from("cvs").select("template_id,data").eq("id", id).single();
  if (!cv) notFound();

  const tpl = getTemplate(cv.template_id);
  return (
    <div className="cv-page" style={{ width: "auto", minHeight: "auto" }}>
      <CvSheet data={normalizeCv(cv.data)} templateId={tpl.id} />
    </div>
  );
}
