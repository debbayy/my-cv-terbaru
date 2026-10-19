"use client";
import { useEffect, useState } from "react";
import { normalizeCv, type CvData } from "@/lib/cv";
import { getTemplate } from "@/lib/templates";

type Payload = { templateId: string; data: CvData };

/**
 * Halaman render PDF tanpa database: Chromium di server menyuntikkan isian CV ke window.__CVKU__
 * sebelum halaman dibuka. Dibuka langsung di browser biasa → kosong.
 */
export default function PrintLive() {
  const [p, setP] = useState<Payload | null>(null);
  useEffect(() => {
    const w = window as unknown as { __CVKU__?: Payload };
    if (w.__CVKU__) setP(w.__CVKU__);
  }, []);
  useEffect(() => {
    if (p) requestAnimationFrame(() => document.body.setAttribute("data-ready", "1"));
  }, [p]);
  if (!p) return null;
  const tpl = getTemplate(p.templateId);
  return (
    <div className="cv-page" style={{ width: "auto", minHeight: "auto" }}>
      <tpl.Component data={normalizeCv(p.data)} />
    </div>
  );
}
