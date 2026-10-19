"use client";
import type { CardData } from "@/lib/card";
import { getCardTemplate } from "@/lib/card-templates";

export type CardDraft = { templateId: string; data: CardData; updatedAt: number };
const KEY = "cvku:card-draft:v1";

export function loadCardDraft(): CardDraft | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CardDraft) : null;
  } catch {
    return null;
  }
}
export function saveCardDraft(d: Omit<CardDraft, "updatedAt">) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...d, updatedAt: Date.now() }));
    return true;
  } catch {
    return false;
  }
}
export function clearCardDraft() {
  try { localStorage.removeItem(KEY); } catch { /* abaikan */ }
}
export const newCardDraft = (templateId: string): CardDraft => {
  const t = getCardTemplate(templateId);
  return { templateId: t.id, data: { ...t.defaults }, updatedAt: Date.now() };
};
