"use client";
import { useLayoutEffect, useRef, useState } from "react";
import type { CvData } from "@/lib/cv";
import { getTemplate } from "@/lib/templates";

const MM = 96 / 25.4;
/** Isian sampai 25% lebih panjang dari 1 halaman → diperkecil sedikit supaya tetap 1 halaman. */
const MAX_OVERFLOW = 1.25;
const MIN_ZOOM = 0.78;

/** Tinggi area isi 1 halaman (px CSS) — sama dengan area cetak PDF. */
export function pageArea(templateId: string) {
  const m = getTemplate(templateId).pdfMargin;
  const padded = m.top !== "0";
  return padded ? (297 - parseFloat(m.top) - parseFloat(m.bottom)) * MM : 296 * MM; // full-bleed: 1 lembar penuh (−1mm pembulatan)
}

/** Bawah konten nyata (teks/gambar) dalam px CSS relatif ke `outer` — tidak terpengaruh transform preview. */
function contentBottom(outer: HTMLElement) {
  const r = outer.getBoundingClientRect();
  const k = outer.offsetWidth ? r.width / outer.offsetWidth : 1;
  let max = 0;
  const range = document.createRange();
  const walker = document.createTreeWalker(outer, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue;
    range.selectNodeContents(n);
    const b = range.getBoundingClientRect().bottom;
    if (b > max) max = b;
  }
  outer.querySelectorAll("img").forEach((img) => {
    const b = img.getBoundingClientRect().bottom;
    if (b > max) max = b;
  });
  return max ? (max - r.top) / k : 0;
}

export type FitInfo = { zoom: number; pages: number };

/**
 * Template CV + aturan "pas halaman" yang SAMA untuk preview dan PDF, supaya hasil download = preview.
 * - Isian ≤ 1,25 halaman → diperkecil seperlunya agar muat 1 halaman.
 * - Lebih panjang → dibiarkan multi-halaman (preview menampilkan garis batas halaman).
 */
export default function CvSheet({
  data, templateId, onFit,
}: { data: CvData; templateId: string; onFit?: (info: FitInfo) => void }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const tpl = getTemplate(templateId);
  const fullBleed = tpl.pdfMargin.top === "0";

  useLayoutEffect(() => {
    let cancelled = false;
    const run = () => {
      const o = outer.current, i = inner.current;
      if (!o || !i || cancelled) return;
      const area = pageArea(templateId);
      const root = i.firstElementChild as HTMLElement | null;
      // Full-bleed (sidebar berwarna + padding sendiri): ukur tinggi alami template tanpa min-height.
      // Template biasa: ukur sampai teks terakhir (margin kertas diatur PDF).
      const natural = () => {
        if (!fullBleed || !root) return contentBottom(o);
        const prev = root.style.minHeight;
        root.style.setProperty("min-height", "0", "important");
        const k = o.offsetWidth ? o.getBoundingClientRect().width / o.offsetWidth : 1;
        const h = root.getBoundingClientRect().height / k;
        root.style.minHeight = prev;
        if (!prev) root.style.removeProperty("min-height");
        return h;
      };
      const measure = (z: number) => { i.style.zoom = String(z); return natural(); };
      let best = 1;
      const h1 = measure(1);
      if (h1 > area && h1 <= area * MAX_OVERFLOW) {
        // cari zoom terbesar yang masih muat 1 halaman (layout dihitung ulang tiap langkah)
        let lo = MIN_ZOOM, hi = 1;
        best = MIN_ZOOM;
        for (let k = 0; k < 8; k++) {
          const mid = (lo + hi) / 2;
          if (measure(mid) <= area) { best = mid; lo = mid; } else hi = mid;
        }
        if (measure(best) > area) best = 1; // tetap tidak muat → biarkan jadi 2 halaman
      }
      i.style.zoom = String(best);
      setZoom(best);
      const h = natural();
      onFit?.({ zoom: best, pages: Math.max(1, Math.ceil((h - 2) / area)) });
    };
    run();
    document.fonts?.ready.then(run);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, templateId]);

  return (
    <div ref={outer} className="cv-fit-outer">
      <div
        ref={inner}
        className="cv-fit"
        style={{ zoom, ...(fullBleed && zoom < 1 ? ({ "--fit": zoom } as React.CSSProperties) : {}) }}
        data-fullbleed={fullBleed && zoom < 1 ? "1" : undefined}
      >
        <tpl.Component data={data} />
      </div>
    </div>
  );
}
