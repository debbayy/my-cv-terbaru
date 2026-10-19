"use client";
import Spinner from "@/components/ui/Spinner";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { canDownload, getAccess } from "@/lib/access";
import { getCardTemplate } from "@/lib/card-templates";
import { clearCardDraft, loadCardDraft } from "@/lib/card-draft";

function Claim() {
  const router = useRouter();
  const params = useSearchParams();
  const format = params.get("format") === "pdf" ? "pdf" : "png";
  const ran = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace(`/login?next=${encodeURIComponent(`/kartu/claim?format=${format}`)}&reason=download`);
      const draft = loadCardDraft();
      if (!draft) return router.replace("/dashboard");
      const { data, error } = await supabase
        .from("cards")
        .insert({ user_id: user.id, template_id: draft.templateId, title: draft.data.headline, data: draft.data })
        .select("id")
        .single();
      if (error || !data) {
        setError(`Gagal menyimpan kartu ke akun (${error?.message ?? "tanpa respons"}). Draft masih aman — coba muat ulang.`);
        return;
      }
      clearCardDraft();
      const after = `/kartu/${data.id}?download=${format}`;
      const tier = getCardTemplate(draft.templateId).tier;
      const pro = canDownload(tier, await getAccess(supabase, user.id));
      // Belum Pro → langsung ke halaman bayar QRIS; setelah lunas otomatis kembali & download
      router.replace(pro ? after : `/bayar?need=${tier}&next=${encodeURIComponent(after)}`);
    })();
  }, [router, format]);

  return error ? (
    <div className="max-w-sm">
      <p className="text-red-700">{error}</p>
      <button onClick={() => location.reload()} className="btn-primary mt-4">Coba lagi</button>
    </div>
  ) : (
    <p className="flex items-center gap-2 text-muted"><Spinner className="h-5 w-5 text-brand" />Menyiapkan download…</p>
  );
}

export default function KartuClaim() {
  return (
    <main className="min-h-app grid place-items-center px-4 text-center">
      <Suspense><Claim /></Suspense>
    </main>
  );
}
