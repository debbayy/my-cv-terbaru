"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveDraft } from "@/lib/draft";
import { saveBlob } from "@/lib/save-blob";
import { createClient } from "@/lib/supabase/client";
import type { CvData } from "@/lib/cv";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { canDownload, showAds, type Access } from "@/lib/access";
import AdSlot from "@/components/ads/AdSlot";
import { PLANS, rupiah } from "@/lib/plans";
import CvForm from "./CvForm";
import CvPreview from "./CvPreview";

type SaveState = "saved" | "saving" | "dirty" | "error";

export default function Editor({
  id, initialTitle, initialTemplate, initialData, access, guest = false, autoDownload = false,
}: {
  /** null = mode tamu (draft di browser, belum login) */
  id: string | null; initialTitle: string; initialTemplate: string; initialData: CvData; access: Access;
  guest?: boolean; autoDownload?: boolean;
}) {
  const supabase = useRef(createClient()).current;
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [templateId, setTemplateId] = useState(initialTemplate);
  const tier = getTemplate(templateId).tier;
  const pro = canDownload(tier, access); // boleh download template ini?
  const [freeLeft, setFreeLeft] = useState(access.freeLeft);
  const isAts = getTemplate(templateId).ats;
  const free = !pro && isAts && freeLeft > 0; // jatah download gratis (khusus CV ATS)
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
    if (guest || !id) {
      const ok = saveDraft({ title, templateId, data });
      setSave(ok ? "saved" : "error");
      return ok;
    }
    const { error } = await supabase.from("cvs").update({ title, template_id: templateId, data }).eq("id", id);
    setSave(error ? "error" : "saved");
    return !error;
  }, [id, guest, supabase]);

  // Autosave 800ms setelah berhenti mengetik
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSave("dirty");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(persist, 800);
  }, [title, templateId, data, persist]);

  // Lanjutkan download otomatis setelah login dari mode tamu
  const autoDone = useRef(false);
  useEffect(() => {
    if (!autoDownload || autoDone.current) return;
    autoDone.current = true;
    router.replace(`/editor/${id}`, { scroll: false });
    download({ auto: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDownload]);

  // Peringatkan kalau keluar sebelum tersimpan
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (save !== "saved") e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [save]);

  async function download(opts?: { auto?: boolean }) {
    setError(null);
    // Tamu: simpan draft, lalu minta login. Setelah login, /claim memindahkan draft ke akun
    // dan membuka editor lagi dengan ?download=1 supaya alurnya langsung lanjut.
    if (guest || !id) {
      await persist();
      const { data: { user } } = await supabase.auth.getUser();
      router.push(user ? "/claim" : "/login?next=/claim&reason=download");
      return;
    }
    // Akun gratis + CV ATS: konfirmasi pakai jatah 1x
    if (free && !opts?.auto && !window.confirm("Download gratis hanya 1x. Pastikan CV kamu sudah final. Lanjut download?")) return;
    // Belum Pro (dan bukan jatah gratis) → langsung ke halaman bayar QRIS, setelah lunas kembali & download otomatis
    if (!pro && !free) {
      await persist();
      router.push(`/bayar?need=${tier}&next=${encodeURIComponent(`/editor/${id}?download=1`)}`);
      return;
    }
    setDownloading(true);
    try {
      if (save !== "saved" && !(await persist())) throw new Error("Gagal menyimpan perubahan terakhir.");
      const res = await fetch(`/api/cv/${id}/pdf`);
      if (res.status === 402) {
        setFreeLeft(0);
        router.push(`/bayar?need=${tier}&next=${encodeURIComponent(`/editor/${id}?download=1`)}`);
        return;
      }
      if (!res.ok) throw new Error("Gagal membuat PDF. Coba lagi sebentar.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      saveBlob(url, `${(data.personal.fullName || title).replace(/[^\w\- ]+/g, "").trim() || "CV"} - CV.pdf`);
      if (free) setFreeLeft(0);
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
      <div className="no-print-app h-app flex flex-col">
        {/* TOP BAR */}
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-white px-3 py-2.5 sm:px-4" style={{ paddingTop: "max(0.625rem, env(safe-area-inset-top))" }}>
          <Link href={guest ? "/" : "/dashboard"} className="text-sm text-muted hover:text-ink">{guest ? "← Beranda" : "← CV Saya"}</Link>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-w-0 flex-1 rounded-md px-2 py-1 font-semibold outline-none hover:bg-paper focus:bg-paper"
            aria-label="Judul CV"
          />
          <span className={`hidden text-xs sm:inline ${save === "error" ? "text-red-600" : "text-muted"}`}>{saveLabel}</span>
          <div className="h-0 basis-full sm:hidden" aria-hidden />
          <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="input min-w-0 flex-1 py-1.5 sm:w-auto sm:flex-none" aria-label="Template">
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}{t.ats ? " (ATS)" : ""}{t.tier === "promax" ? " ★ Pro Max" : ""}</option>
            ))}
          </select>
          <button onClick={() => download()} disabled={downloading} className="btn-primary shrink-0">
            {downloading ? "Membuat PDF…" : free ? "Download Gratis" : "Download PDF"}
            {free ? (
              <span className="rounded bg-white/25 px-1.5 text-[10px] font-bold">1x</span>
            ) : !pro && !guest && !(guest && isAts) ? (
              <span className="rounded bg-gold px-1.5 text-[10px] font-bold text-ink">{tier === "promax" ? "PRO MAX" : "PRO"}</span>
            ) : null}
          </button>
        </header>

        {error && <p className="bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
        {guest && (
          <p className="bg-brand/10 px-4 py-1.5 text-xs text-brand">
            Kamu belum masuk — CV tersimpan otomatis di browser ini. Masuk saat download untuk menyimpannya ke akun.
            {isAts && " CV ATS bisa di-download gratis 1x."}
          </p>
        )}
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

        <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(340px,1fr)_1fr] lg:grid-cols-[minmax(380px,1fr)_1.1fr]">
          <div className={`overflow-y-auto overscroll-contain p-3 pb-safe sm:p-4 ${tab === "form" ? "block" : "hidden"} md:block`}>
            <CvForm data={data} onChange={setData} />
          </div>
          <div className={`overflow-y-auto overscroll-contain bg-[#e9e5dd] p-3 pb-safe sm:p-4 lg:p-8 ${tab === "preview" ? "block" : "hidden"} md:block`}>
            <div className="mx-auto max-w-[680px]">
              <CvPreview data={data} templateId={templateId} watermark={!pro} />
              {showAds(access) && <AdSlot className="mt-6" placement="editor" />}
              {!pro && (
                <p className="mt-3 text-center text-xs text-muted">
                  Watermark hanya ada di preview. {tier === "promax" ? "Template ini termasuk koleksi Pro Max." : "PDF versi Pro bersih & teksnya terbaca ATS."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="no-print-app-msg p-10 text-center">Gunakan tombol &quot;Download PDF&quot; di CVku untuk mengunduh CV.</div>

      {/* PAYWALL */}
      {paywall && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/40 p-3 sm:place-items-center sm:p-4" onClick={() => setPaywall(false)}>
          <div className="pb-safe w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6" onClick={(e) => e.stopPropagation()}>
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
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Link href={`/bayar?next=${encodeURIComponent(`/editor/${id}?download=1`)}`} className="btn-primary flex-1 py-3">
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
