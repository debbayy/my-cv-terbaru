"use client";
import { normalizeCv, sampleCv, type CvData } from "@/lib/cv";

/** Draft CV untuk tamu (belum login) — disimpan di browser sampai user login. */
export type Draft = { title: string; templateId: string; data: CvData; updatedAt: number };

const KEY = "cvku:draft:v1";

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    return { ...d, data: normalizeCv(d.data) };
  } catch {
    return null;
  }
}

export function saveDraft(d: Omit<Draft, "updatedAt">) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...d, updatedAt: Date.now() }));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft() {
  try { localStorage.removeItem(KEY); } catch { /* abaikan */ }
}

export const newDraft = (templateId: string): Draft => ({
  title: "CV Baru",
  templateId,
  data: sampleCv(),
  updatedAt: Date.now(),
});
