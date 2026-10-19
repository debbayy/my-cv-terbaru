"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { CvData } from "@/lib/cv";
import { TEMPLATES } from "@/lib/templates";
import { PLANS, rupiah } from "@/lib/plans";
import CvForm from "./CvForm";
import CvPreview from "./CvPreview";

type SaveState = "saved" | "saving" | "dirty" | "error";

export default function Editor({
  id, initialTitle, initialTemplate, initialData, pro,
}: {
  id: string; initialTitle: string; initialTemplate: string; initialData: CvData; pro: boolean;
}) {
  const supabase = useRef(createClient()).current;
  const [title, setTitle] = useState(initialTitle);
  const [templateId, setTemplateId] = useState(initialTemplate);
  const [data, setData] = useState(initialData);
  const [save, setSave] = useState<SaveState>("saved");
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [downloading, setDownloading] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latest = useRef({ title, templateId, data });
  latest.current = { title, templateId, data };
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  const persist = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setSave("saving");
    const { title, templateId, data } = latest.current;
    const { error } = await supabase.from("cvs").update({ title, template_id: templateId, data }).eq("id", id);
    setSave(error ? "error" : "saved");
    return !error;
  }, [id, supabase]);

  // Autosave 800ms setelah berhenti mengetik
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSave("dirty");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(persist, 800);
  }, [title, templateId, data, persist]);

  // Peringatkan kalau keluar sebelum tersimpan
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (save !== "saved") e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [save]);

  async function download() {
    setError(null);
    if (!pro) { setPaywall(true); return; }
    setDownloading(true);
    try {
      if (save !== "saved" && !(await persist())) throw new Error("Gagal menyimpan perubahan terakhir.");
      const res = await fetch(`/api/cv/${id}/pdf`);
      if (res.status === 402) { setPaywall(true); return; }
      if (!res.ok) throw new Error("Gagal membuat PDF. Coba lagi sebentar.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(data.personal.fullName || title).replace(/[^\w\- ]+/g, "").trim() || "CV"} - CV.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setDownloading(false);
    }
  }

  const saveLabel = { saved: "Tersimpan", saving: "Menyimpan…", dirty: "Belum tersimpan", error: "Gagal simpan" }[save];
  const tpl = TEMPLATES.find((t) => t.id === templateId);

  return (
    <>
      <div className="no-print-app flex h-screen flex-col">
        {/* TOP BAR */}
        <header className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-2.5">
          <Link href="/dashboard" className="text-sm text-muted hover:text-ink">← CV Saya</Link>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-w-0 flex-1 rounded-md px-2 py-1 font-semibold outline-none hover:bg-paper focus:bg-paper"
            aria-label="Judul CV"
          />
          <span className={`hidden text-xs sm:inline ${save === "error" ? "text-red-600" : "text-muted"}`}>{saveLabel}</span>
          <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="input w-auto py-1.5" aria-label="Template">
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}{t.ats ? " (ATS)" : ""}</option>
            ))}
          </select>
          <button onClick={download} disabled={downloading} className="btn-primary">
            {downloading ? "Membuat PDF…" : "Download PDF"}
            {!pro && <span className="rounded bg-gold px-1.5 text-[10px] font-bold text-ink">PRO</span>}
          </button>
        </header>

        {error && <p className="bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
        {tpl && !tpl.ats && (
          <p className="bg-gold/20 px-4 py-1.5 text-xs">
            Template ini dua kolom & berwarna — bagus untuk dikirim langsung, tapi kurang ideal untuk portal lamaran berbasis ATS.
          </p>
        )}

        {/* Tab mobile */}
        <div className="flex border-b border-line bg-white md:hidden">
          {(["form", "preview"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm font-medium ${tab === t ? "border-b-2 border-brand text-brand" : "text-muted"}`}>
              {t === "form" ? "Isi Data" : "Preview"}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(380px,1fr)_1.1fr]">
          <div className={`overflow-y-auto p-4 ${tab === "form" ? "block" : "hidden"} md:block`}>
            <CvForm data={data} onChange={setData} />
          </div>
          <div className={`overflow-y-auto bg-[#e9e5dd] p-4 md:p-8 ${tab === "preview" ? "block" : "hidden"} md:block`}>
            <div className="mx-auto max-w-[680px]">
              <CvPreview data={data} templateId={templateId} watermark={!pro} />
              {!pro && (
                <p className="mt-3 text-center text-xs text-muted">
                  Watermark hanya ada di preview. PDF versi Pro bersih & teksnya terbaca ATS.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="no-print-app-msg p-10 text-center">Gunakan tombol &quot;Download PDF&quot; di CVku untuk mengunduh CV.</div>

      {/* PAYWALL */}
      {paywall && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setPaywall(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="mb-2 inline-block rounded-full bg-gold px-2 py-0.5 text-xs font-bold">PRO</p>
            <h2 className="font-display text-2xl font-bold">CV kamu sudah siap 🎉</h2>
            <p className="mt-2 text-muted">
              Upgrade ke Pro untuk download PDF tanpa watermark, berbasis teks, dan siap dikirim ke portal lamaran.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm">
              <li>✓ Download PDF tanpa batas</li>
              <li>✓ Semua template, termasuk desain bebas</li>
              <li>✓ Simpan & edit banyak versi CV</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Link href={`/pricing?from=${id}`} className="btn-primary flex-1 py-3">
                Upgrade {rupiah(PLANS.pro_monthly.price)} / 30 hari
              </Link>
              <button onClick={() => setPaywall(false)} className="btn-ghost">Nanti</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
