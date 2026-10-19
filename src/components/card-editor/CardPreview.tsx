"use client";
import { useEffect, useRef, useState } from "react";
import { CARD_H, CARD_W, type CardData } from "@/lib/card";
import { getCardTemplate } from "@/lib/card-templates";
import { useVeil } from "@/lib/use-veil";

/** Kanvas kartu 540x675 yang diskalakan ke lebar container. */
export default function CardPreview({
  data, templateId, watermark = false,
}: { data: CardData; templateId: string; watermark?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const t = getCardTemplate(templateId);
  const veiled = useVeil(watermark);

  useEffect(() => {
    if (!wrap.current) return;
    const ro = new ResizeObserver(() => wrap.current && setScale(wrap.current.clientWidth / CARD_W));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`veil-wrap w-full overflow-hidden rounded-xl ${veiled ? "veiled" : ""}`} style={{ height: CARD_H * scale }}>
      <div
        className="veil-target"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: CARD_W, height: CARD_H, position: "relative", userSelect: watermark ? "none" : undefined }}
        onCopy={watermark ? (e) => e.preventDefault() : undefined}
      >
        <t.Component data={data} />
        {watermark && (
          <div className="card-watermark" aria-hidden><span>CVku • PREVIEW</span></div>
        )}
      </div>
      {watermark && <div className="veil-msg">Preview disembunyikan.<br />Klik halaman untuk lanjut.</div>}
    </div>
  );
}
