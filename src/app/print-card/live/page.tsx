"use client";
import { useEffect, useState } from "react";
import { normalizeCard, type CardData } from "@/lib/card";
import { getCardTemplate } from "@/lib/card-templates";

type Payload = { templateId: string; data: CardData };

/** Seperti /print/live tapi untuk kartu ucapan. */
export default function PrintCardLive() {
  const [p, setP] = useState<Payload | null>(null);
  useEffect(() => {
    const w = window as unknown as { __CVKU__?: Payload };
    if (w.__CVKU__) setP(w.__CVKU__);
  }, []);
  useEffect(() => {
    if (p) requestAnimationFrame(() => document.body.setAttribute("data-ready", "1"));
  }, [p]);
  if (!p) return null;
  const t = getCardTemplate(p.templateId);
  return <t.Component data={normalizeCard(p.data, t.defaults)} />;
}
