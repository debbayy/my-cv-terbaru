"use client";
import Spinner from "@/components/ui/Spinner";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { canDownload, canUseFree, getAccess } from "@/lib/access";
import { getTemplate } from "@/lib/templates";
import { clearDraft, loadDraft } from "@/lib/draft";

/** Setelah login: pindahkan draft tamu ke akun, lalu lanjutkan download. */
export default function ClaimPage() {
  const router = useRouter();
  const ran = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/login?next=/claim&reason=download");

      const draft = loadDraft();
      if (!draft) return router.replace("/dashboard");

      const { data, error } = await supabase
        .from("cvs")
        .insert({ user_id: user.id, title: draft.title, template_id: draft.templateId, data: draft.data })
        .select("id")
        .single();

      if (error || !data) {
        setError(`Gagal menyimpan CV ke akun kamu (${error?.message ?? "tanpa respons"}). Draft masih aman di browser — coba muat ulang halaman ini.`);
        return;
      }
      clearDraft();
      const after = `/editor/${data.id}?download=1`;
      const tier = getTemplate(draft.templateId).tier;
      const acc = await getAccess(supabase, user.id);
      // Punya paket, atau masih ada jatah gratis untuk CV ATS → langsung download
      const pro = canDownload(tier, acc) || canUseFree(getTemplate(draft.templateId).ats, acc);
      // Belum Pro → langsung ke halaman bayar QRIS; setelah lunas otomatis kembali & download
      router.replace(pro ? after : `/bayar?need=${tier}&next=${encodeURIComponent(after)}`);
    })();
  }, [router]);

  return (
    <main className="min-h-app grid place-items-center px-4 text-center">
      {error ? (
        <div className="max-w-sm">
          <p className="text-red-700">{error}</p>
          <button onClick={() => location.reload()} className="btn-primary mt-4">Coba lagi</button>
        </div>
      ) : (
        <p className="flex items-center gap-2 text-muted"><Spinner className="h-5 w-5 text-brand" />Menyiapkan download…</p>
      )}
    </main>
  );
}
