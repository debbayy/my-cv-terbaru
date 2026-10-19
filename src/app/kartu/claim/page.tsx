"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
        setError("Gagal menyimpan kartu ke akun. Draft masih aman — coba muat ulang.");
        return;
      }
      clearCardDraft();
      router.replace(`/kartu/${data.id}?download=${format}`);
    })();
  }, [router, format]);

  return error ? (
    <div className="max-w-sm">
      <p className="text-red-700">{error}</p>
      <button onClick={() => location.reload()} className="btn-primary mt-4">Coba lagi</button>
    </div>
  ) : (
    <p className="text-muted">Menyimpan kartu ke akun kamu…</p>
  );
}

export default function KartuClaim() {
  return (
    <main className="min-h-app grid place-items-center px-4 text-center">
      <Suspense><Claim /></Suspense>
    </main>
  );
}
