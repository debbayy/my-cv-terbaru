"use client";
import { useEffect, useRef, useState } from "react";
import type { CvData } from "@/lib/cv";
import { getTemplate } from "@/lib/templates";
import { useVeil } from "@/lib/use-veil";
import CvSheet, { pageArea, type FitInfo } from "@/components/cv/CvSheet";

const MM = 96 / 25.4;

const A4_PX = 794; // 210mm @ 96dpi

/** Render template di "kertas" A4 yang diskalakan menyesuaikan lebar container. */
export default function CvPreview({
  data,
  templateId,
  watermark = false,
  showFitNote = false,
}: {
  data: CvData;
  templateId: string;
  watermark?: boolean;
  /** Tampilkan keterangan jumlah halaman / pengecilan di bawah preview (editor). */
  showFitNote?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [height, setHeight] = useState(1123);
  const tpl = getTemplate(templateId);
  const padded = tpl.pdfMargin.top !== "0";
  const veiled = useVeil(watermark);
  const [fit, setFit] = useState<FitInfo>({ zoom: 1, pages: 1 });

  useEffect(() => {
    if (!wrap.current || !page.current) return;
    const ro = new ResizeObserver(() => {
      if (wrap.current) setScale(wrap.current.clientWidth / A4_PX);
      if (page.current) setHeight(page.current.offsetHeight);
    });
    ro.observe(wrap.current);
    ro.observe(page.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`veil-wrap w-full ${veiled ? "veiled" : ""}`} style={{ height: height * scale }}>
      <div
        ref={page}
        className={`veil-target cv-page shadow-[0_8px_30px_rgba(0,0,0,.08)] ${padded ? "pad" : ""}`}
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", userSelect: watermark ? "none" : undefined }}
        onCopy={watermark ? (e) => e.preventDefault() : undefined}
      >
        <CvSheet data={data} templateId={templateId} onFit={setFit} />
        {/* Batas halaman PDF — supaya preview = hasil download */}
        {Array.from({ length: fit.pages - 1 }).map((_, i) => (
          <div key={i} className="cv-pagebreak" style={{ top: (padded ? parseFloat(tpl.pdfMargin.top) * MM : 0) + pageArea(templateId) * (i + 1) }}>
            <span>Halaman {i + 2} ↓</span>
          </div>
        ))}
        {watermark && (
          <div className="cv-watermark" aria-hidden>
            <span>CVku • PREVIEW</span>
          </div>
        )}
      </div>
      {showFitNote && (fit.pages > 1 || fit.zoom < 1) && (
        <p className="pointer-events-none absolute -bottom-6 left-0 right-0 text-center text-[11px] text-muted">
          {fit.pages > 1 ? `Hasil PDF: ${fit.pages} halaman` : `Diperkecil ${Math.round((1 - fit.zoom) * 100)}% supaya muat 1 halaman`}
        </p>
      )}
      {watermark && <div className="veil-msg">Preview disembunyikan.<br />Klik halaman untuk lanjut.</div>}
    </div>
  );
}
