"use client";
import { useEffect, useRef, useState } from "react";
import type { CvData } from "@/lib/cv";
import { getTemplate } from "@/lib/templates";
import { useVeil } from "@/lib/use-veil";

const A4_PX = 794; // 210mm @ 96dpi

/** Render template di "kertas" A4 yang diskalakan menyesuaikan lebar container. */
export default function CvPreview({
  data,
  templateId,
  watermark = false,
}: {
  data: CvData;
  templateId: string;
  watermark?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [height, setHeight] = useState(1123);
  const tpl = getTemplate(templateId);
  const padded = tpl.pdfMargin.top !== "0";
  const veiled = useVeil(watermark);

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
        <tpl.Component data={data} />
        {watermark && (
          <div className="cv-watermark" aria-hidden>
            <span>CVku • PREVIEW</span>
          </div>
        )}
      </div>
      {watermark && <div className="veil-msg">Preview disembunyikan.<br />Klik halaman untuk lanjut.</div>}
    </div>
  );
}
