"use client";
import { useEffect, useRef, useState } from "react";
import { CARD_H, CARD_W, type CardData } from "@/lib/card";
import { getCardTemplate } from "@/lib/card-templates";

/** Kanvas kartu 540x675 yang diskalakan ke lebar container. */
export default function CardPreview({
  data, templateId, watermark = false,
}: { data: CardData; templateId: string; watermark?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const t = getCardTemplate(templateId);

  useEffect(() => {
    if (!wrap.current) return;
    const ro = new ResizeObserver(() => wrap.current && setScale(wrap.current.clientWidth / CARD_W));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className="w-full overflow-hidden rounded-xl" style={{ height: CARD_H * scale }}>
      <div
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: CARD_W, height: CARD_H, position: "relative", userSelect: watermark ? "none" : undefined }}
        onCopy={watermark ? (e) => e.preventDefault() : undefined}
      >
        <t.Component data={data} />
        {watermark && (
          <div className="card-watermark" aria-hidden><span>CVku • PREVIEW</span></div>
        )}
      </div>
    </div>
  );
}
