"use client";
import { useEffect, useState } from "react";
import { normalizeCv, type CvData } from "@/lib/cv";
import CvSheet from "@/components/cv/CvSheet";

type Payload = { templateId: string; data: CvData };

/**
 * Halaman render PDF tanpa database: Chromium di server menyuntikkan isian CV ke window.__CVKU__
 * sebelum halaman dibuka. Memakai CvSheet yang sama dengan preview → hasil PDF = preview.
 */
export default function PrintLive() {
  const [p, setP] = useState<Payload | null>(null);
  useEffect(() => {
    const w = window as unknown as { __CVKU__?: Payload };
    if (w.__CVKU__) setP({ ...w.__CVKU__, data: normalizeCv(w.__CVKU__.data) });
  }, []);
  if (!p) return null;
  return (
    <div className="cv-page" style={{ width: "auto", minHeight: "auto" }}>
      <CvSheet
        data={p.data}
        templateId={p.templateId}
        onFit={() => document.fonts.ready.then(() => requestAnimationFrame(() => document.body.setAttribute("data-ready", "1")))}
      />
    </div>
  );
}
