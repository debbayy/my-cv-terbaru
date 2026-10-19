"use client";
import { useEffect, useState } from "react";
import CardEditor from "@/components/card-editor/CardEditor";
import { loadCardDraft, newCardDraft, saveCardDraft, type CardDraft } from "@/lib/card-draft";
import { getCardTemplate } from "@/lib/card-templates";

export default function GuestCardEditor({ template, pro }: { template?: string; pro: boolean }) {
  const [draft, setDraft] = useState<CardDraft | null>(null);

  useEffect(() => {
    const existing = loadCardDraft();
    const t = template ? getCardTemplate(template) : null;
    let d: CardDraft;
    if (!existing) d = newCardDraft(t?.id ?? "ultah-confetti");
    else if (t && getCardTemplate(existing.templateId).occasion !== t.occasion) d = newCardDraft(t.id); // acara beda → mulai dari teks contoh
    else d = { ...existing, templateId: t?.id ?? existing.templateId };
    saveCardDraft(d);
    setDraft(d);
  }, [template]);

  if (!draft) return <div className="min-h-app grid place-items-center text-sm text-muted">Menyiapkan kartu…</div>;
  return <CardEditor id={null} guest pro={pro} initialTemplate={draft.templateId} initialData={draft.data} />;
}
