import "server-only";
import type { Page } from "puppeteer-core";
import type { NextRequest } from "next/server";

/**
 * Teruskan cookie login user ke halaman print yang dibuka Chromium, supaya halaman itu bisa membaca
 * CV/kartu milik user lewat RLS. Dengan begitu tidak butuh service role key dan tidak ada data yang bisa
 * dibaca tanpa sesi + token 60 detik.
 */
export async function forwardSession(page: Page, req: NextRequest, base: string) {
  const cookies = req.cookies.getAll().filter((c) => c.name.startsWith("sb-"));
  if (cookies.length) await page.setCookie(...cookies.map((c) => ({ name: c.name, value: c.value, url: base })));
}

/** Pesan error singkat yang aman ditampilkan ke user (tanpa path/secret). */
export function errorDetail(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  return m.replace(/\/[^\s]+/g, "…").slice(0, 160);
}
