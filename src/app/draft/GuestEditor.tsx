"use client";
import { useEffect, useState } from "react";
import Editor from "@/components/editor/Editor";
import { loadDraft, newDraft, saveDraft, type Draft } from "@/lib/draft";
import { getTemplate } from "@/lib/templates";

export default function GuestEditor({ template, pro }: { template?: string; pro: boolean }) {
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    const existing = loadDraft();
    const templateId = template ? getTemplate(template).id : undefined;
    // Kalau sudah ada draft, pertahankan isiannya — cukup ganti template yang dipilih
    const d = existing
      ? { ...existing, templateId: templateId ?? existing.templateId }
      : newDraft(templateId ?? "ats-classic");
    saveDraft(d);
    setDraft(d);
  }, [template]);

  if (!draft) {
    return <div className="min-h-app grid place-items-center text-sm text-muted">Menyiapkan editor…</div>;
  }

  return (
    <Editor
      id={null}
      guest
      pro={pro}
      initialTitle={draft.title}
      initialTemplate={draft.templateId}
      initialData={draft.data}
    />
  );
}
