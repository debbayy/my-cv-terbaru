"use client";
import { useMemo, useState } from "react";
import type { CvData } from "@/lib/cv";

const STOP = new Set(
  ("yang dan atau dengan untuk dari pada dalam akan adalah ini itu kami kamu anda kita juga serta oleh sebagai minimal maksimal " +
   "memiliki mampu dapat bisa lebih tahun pengalaman bidang posisi kerja bekerja kandidat calon pelamar perusahaan tim baik " +
   "sangat diutamakan menjadi memahami terbiasa mengerti siap bersedia tinggi wajib syarat kualifikasi tanggung jawab tugas " +
   "the and or with for from in on of to a an is are be will our your you we as by at have has strong good excellent " +
   "ability able experience years year plus preferred required requirements responsibilities team work working candidate " +
   "including etc must should well knowledge understanding skills skill job role company " +
   "mencari menguasai nilai tambah dibutuhkan membutuhkan lowongan diharapkan menggunakan berpengalaman familiar " +
   "proficient proficiency using use looking seeking join hiring min max").split(" "),
);

/** Ambil kata kunci penting dari deskripsi lowongan (frasa 1–2 kata, termasuk istilah teknis seperti Next.js, C++). */
function keywords(jd: string) {
  const words = jd.toLowerCase().replace(/[^\p{L}\p{N}+#./\s-]/gu, " ").split(/\s+/).map((w) => w.replace(/^[.\-/]+|[.\-/]+$/g, "")).filter(Boolean);
  const count = new Map<string, number>();
  words.forEach((w, i) => {
    if (w.length < 3 && !/[+#]/.test(w)) return;
    if (STOP.has(w) || /^\d+$/.test(w)) return;
    count.set(w, (count.get(w) ?? 0) + 1);
    const n = words[i + 1];
    if (n && !STOP.has(n) && n.length > 2) count.set(`${w} ${n}`, (count.get(`${w} ${n}`) ?? 0) + 0.6);
  });
  return [...count.entries()]
    .filter(([k]) => k.length >= 3 || /[+#]/.test(k))
    .filter(([k, v]) => (k.includes(" ") ? v >= 1.2 : true))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([k]) => k);
}

export default function AtsChecker({ data, onAddSkill }: { data: CvData; onAddSkill: (s: string) => void }) {
  const [jd, setJd] = useState("");
  // Foto (base64) dikecualikan supaya tidak memicu kecocokan palsu
  const cvText = useMemo(
    () => JSON.stringify({ ...data, personal: { ...data.personal, photo: undefined } }).toLowerCase(),
    [data],
  );
  const result = useMemo(() => {
    if (jd.trim().length < 40) return null;
    const ks = keywords(jd);
    const hit = ks.filter((k) => cvText.includes(k));
    const miss = ks.filter((k) => !cvText.includes(k));
    return { score: Math.round((hit.length / Math.max(ks.length, 1)) * 100), hit, miss };
  }, [jd, cvText]);

  const color = !result ? "" : result.score >= 70 ? "text-brand" : result.score >= 45 ? "text-[#b7791f]" : "text-red-600";

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">Paste deskripsi lowongan yang mau kamu lamar. Kami cek kata kunci mana yang sudah ada di CV — ATS biasanya menyaring berdasarkan kecocokan kata kunci.</p>
      <textarea className="input" rows={5} value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Contoh: Kami mencari Frontend Developer yang menguasai React, TypeScript, Next.js, REST API…" />
      {result && (
        <div className="rounded-lg border border-line bg-paper/60 p-3">
          <p className="text-sm">
            Kecocokan: <span className={`text-2xl font-bold ${color}`}>{result.score}%</span>
          </p>
          {result.miss.length > 0 && (
            <>
              <p className="mt-2 text-xs font-semibold text-muted">Belum ada di CV — klik untuk tambah ke Keahlian (hanya yang benar-benar kamu kuasai):</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {result.miss.map((k) => (
                  <button key={k} type="button" onClick={() => onAddSkill(k)} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-700 hover:bg-red-100">
                    + {k}
                  </button>
                ))}
              </div>
            </>
          )}
          {result.hit.length > 0 && (
            <>
              <p className="mt-3 text-xs font-semibold text-muted">Sudah cocok:</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {result.hit.map((k) => <span key={k} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">✓ {k}</span>)}
              </div>
            </>
          )}
          <p className="mt-3 text-[11px] text-muted">Tips: pakai istilah yang sama persis dengan lowongan, dan sebutkan juga di poin pengalaman kerja, bukan hanya di Keahlian.</p>
        </div>
      )}
    </div>
  );
}
