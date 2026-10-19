"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
        setError("Gagal menyimpan CV ke akun kamu. Draft masih aman di browser — coba muat ulang halaman ini.");
        return;
      }
      clearDraft();
      router.replace(`/editor/${data.id}?download=1`);
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
        <p className="text-muted">Menyimpan CV ke akun kamu…</p>
      )}
    </main>
  );
}
