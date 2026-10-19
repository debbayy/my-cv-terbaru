"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImportCv, { summarize } from "@/components/import/ImportCv";
import Spinner from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { saveDraft } from "@/lib/draft";
import type { ImportResult } from "@/lib/cv-import";

const TEMPLATE = "ats-classic";

export default function ImportClient() {
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function open(r: ImportResult) {
    setResult(r);
    setOpening(true);
    const title = r.data.personal.fullName ? `CV ${r.data.personal.fullName}` : "CV Baru";
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from("cvs").insert({ user_id: user.id, title, template_id: TEMPLATE, data: r.data }).select("id").single();
        if (!error && data) return router.push(`/editor/${data.id}`);
      }
    } catch { /* jaringan/Supabase bermasalah → pakai draft di browser */ }
    // Tamu (atau gagal simpan ke akun): simpan di browser, editor tamu langsung memuatnya
    saveDraft({ title, templateId: TEMPLATE, data: r.data });
    router.push(`/draft?template=${TEMPLATE}`);
  }

  return (
    <div className="mt-8">
      <ImportCv variant="dropzone" label="Upload CV lama kamu" onDone={open} />
      {opening && result && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand" role="status">
          <Spinner className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">{summarize(result)}</p>
            <p className="text-xs">Membuka editor…</p>
          </div>
        </div>
      )}
    </div>
  );
}
