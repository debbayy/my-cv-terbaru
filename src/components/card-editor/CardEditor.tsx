"use client";
import Spinner from "@/components/ui/Spinner";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { OCCASIONS, type CardData } from "@/lib/card";
import { CARD_TEMPLATES, getCardTemplate } from "@/lib/card-templates";
import { saveCardDraft } from "@/lib/card-draft";
import { canDownload, showAds, type Access } from "@/lib/access";
import AdSlot from "@/components/ads/AdSlot";
import { saveBlob } from "@/lib/save-blob";
import { PLANS, rupiah } from "@/lib/plans";
import CardPreview from "./CardPreview";

type Format = "png" | "pdf";

export default function CardEditor({
  id, initialTemplate, initialData, access, guest = false, autoDownload,
}: {
  id: string | null; initialTemplate: string; initialData: CardData; access: Access;
  guest?: boolean; autoDownload?: Format | null;
}) {
  const supabase = useRef(createClient()).current;
  const router = useRouter();
  const [templateId, setTemplateId] = useState(initialTemplate);
  const tier = getCardTemplate(templateId).tier;
  const pro = canDownload(tier, access);
  const [data, setData] = useState(initialData);
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState<Format | null>(null);
  const [navigating, setNavigating] = useState(false);
  const go = (url: string) => { setNavigating(true); router.push(url); };
  const [paywall, setPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latest = useRef({ templateId, data });
  latest.current = { templateId, data };
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  const persist = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    const { templateId, data } = latest.current;
    let ok = true;
    if (guest || !id) ok = saveCardDraft({ templateId, data });
    else ok = !(await supabase.from("cards").update({ template_id: templateId, data, title: data.headline }).eq("id", id)).error;
    setSaved(ok);
    return ok;
  }, [guest, id, supabase]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(persist, 700);
  }, [templateId, data, persist]);

  async function download(format: Format) {
    if (busy || navigating) return;
    setError(null);
    if (guest || !id) {
      await persist();
      const { data: { user } } = await supabase.auth.getUser();
      const next = `/kartu/claim?format=${format}`;
      go(user ? next : `/login?next=${encodeURIComponent(next)}&reason=download`);
      return;
    }
    if (!pro) {
      setNavigating(true);
      await persist();
      go(`/bayar?need=${tier}&next=${encodeURIComponent(`/kartu/${id}?download=${format}`)}`);
      return;
    }
    setBusy(format);
    try {
      if (!saved && !(await persist())) throw new Error("Gagal menyimpan perubahan terakhir.");
      const res = await fetch(`/api/card/${id}/export?format=${format}`);
      if (res.status === 402) {
        go(`/bayar?need=${tier}&next=${encodeURIComponent(`/kartu/${id}?download=${format}`)}`);
        return;
      }
      if (!res.ok) throw new Error("Gagal membuat file. Coba lagi sebentar.");
      const blob = await res.blob();
      const name = `Kartu - ${data.headline.replace(/[^\w\- ]+/g, "").trim() || "Ucapan"}.${format}`;
      // Di HP (iPhone/Android): buka menu Share → langsung kirim ke WhatsApp/IG. Desktop: download biasa.
      const file = new File([blob], name, { type: blob.type });
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
      const mobile = matchMedia("(pointer: coarse)").matches;
      if (mobile && format === "png" && nav.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title: data.headline }); return; } catch { /* dibatalkan → fallback download */ }
      }
      saveBlob(URL.createObjectURL(blob), name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(null);
    }
  }

  const autoDone = useRef(false);
  useEffect(() => {
    if (!autoDownload || autoDone.current || !id) return;
    autoDone.current = true;
    router.replace(`/kartu/${id}`, { scroll: false });
    download(autoDownload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDownload]);

  const set = (k: keyof CardData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData({ ...data, [k]: e.target.value });

  const current = getCardTemplate(templateId);

  return (
    <>
      <div className="no-print-app min-h-app">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-white px-3 py-2.5 sm:px-4" style={{ paddingTop: "max(0.625rem, env(safe-area-inset-top))" }}>
          <Link href={guest ? "/kartu" : "/dashboard"} className="text-sm text-muted hover:text-ink">
            ← {guest ? "Semua kartu" : "Dashboard"}
          </Link>
          <p className="min-w-0 flex-1 truncate font-semibold">{current.name}</p>
          <span className="hidden text-xs text-muted sm:inline">{saved ? "Tersimpan" : "Menyimpan…"}</span>
          <div className="h-0 basis-full sm:hidden" aria-hidden />
          <button onClick={() => download("png")} disabled={!!busy || navigating} aria-busy={busy === "png"} className="btn-primary flex-1 sm:flex-none">
            {(busy === "png" || navigating) && <Spinner />}
            {busy === "png" ? "Membuat…" : navigating ? "Membuka…" : "Download PNG"}
          </button>
          <button onClick={() => download("pdf")} disabled={!!busy || navigating} aria-busy={busy === "pdf"} className="btn-ghost">
            {busy === "pdf" && <Spinner />}
            {busy === "pdf" ? "Membuat…" : "PDF"}
          </button>
        </header>
        {error && <p className="bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
        {guest && (
          <p className="bg-brand/10 px-4 py-1.5 text-xs text-brand">
            Belum masuk? Nggak apa-apa — kartu tersimpan di browser ini. Masuk saat download.
          </p>
        )}

        <div className="pb-safe mx-auto grid max-w-6xl gap-6 p-3 sm:p-4 md:grid-cols-[1fr_340px] md:gap-8 lg:grid-cols-[1fr_420px] lg:p-8">
          <div className="order-2 space-y-5 md:order-1">
            <div className="space-y-3 rounded-xl border border-line bg-white p-4">
              <div>
                <label className="label">Judul</label>
                <input className="input" value={data.headline} onChange={set("headline")} />
              </div>
              <div>
                <label className="label">Untuk</label>
                <input className="input" value={data.to} onChange={set("to")} />
              </div>
              <div>
                <label className="label">Pesan (enter untuk baris baru)</label>
                <textarea className="input" rows={4} value={data.message} onChange={set("message")} />
              </div>
              <div>
                <label className="label">Dari</label>
                <input className="input" value={data.from} onChange={set("from")} />
              </div>
              <button
                type="button"
                className="text-xs text-muted underline"
                onClick={() => setData({ ...current.defaults })}
              >
                Kembalikan ke teks contoh
              </button>
            </div>

            <div>
              <p className="label">Ganti desain (isian tetap)</p>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
                {CARD_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`rounded-lg border-2 p-1 text-left transition ${t.id === templateId ? "border-brand" : "border-transparent hover:border-line"}`}
                  >
                    <div className="pointer-events-none">
                      <CardPreview data={t.defaults} templateId={t.id} />
                    </div>
                    <p className="mt-1 truncate text-[11px] text-muted">
                      {t.tier === "promax" ? <span className="font-bold text-ink">★ </span> : null}{OCCASIONS[t.occasion]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="mx-auto max-w-[360px] md:sticky md:top-20 md:max-w-none">
              <CardPreview data={data} templateId={templateId} watermark={!pro} />
              {showAds(access) && <AdSlot className="mt-4" placement="editor" />}
              <p className="mt-2 text-center text-xs text-muted">
                PNG 1080×1350 — pas untuk WhatsApp & Instagram. PDF untuk dicetak.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print-app-msg p-10 text-center">Gunakan tombol Download di CVku.</div>

      {paywall && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/40 p-3 sm:place-items-center sm:p-4" onClick={() => setPaywall(false)}>
          <div className="pb-safe w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6" onClick={(e) => e.stopPropagation()}>
            <p className="mb-2 inline-block rounded-full bg-gold px-2 py-0.5 text-xs font-bold">PRO</p>
            <h2 className="font-display text-2xl font-bold">Kartumu sudah cantik 💌</h2>
            <p className="mt-2 text-muted">Upgrade ke Pro untuk download kartu & CV tanpa watermark, sepuasnya.</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Link href={`/bayar?next=${encodeURIComponent(`/kartu/${id}?download=png`)}`} className="btn-primary flex-1 py-3">
                Bayar {rupiah(PLANS.pro_monthly.price)} via QRIS
              </Link>
              <button onClick={() => setPaywall(false)} className="btn-ghost">Nanti</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
