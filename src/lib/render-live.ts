import "server-only";
import type { Page } from "puppeteer-core";
import { launchBrowser } from "@/lib/browser";

/**
 * Buka halaman /print/live atau /print-card/live di Chromium dengan data disuntikkan langsung,
 * lalu jalankan `capture`. Tidak butuh database, sesi login, maupun service role key.
 */
export async function renderLive<T>(
  url: string,
  payload: unknown,
  setup: (page: Page) => Promise<void>,
  capture: (page: Page) => Promise<T>,
): Promise<T> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await setup(page);
    await page.evaluateOnNewDocument((d) => {
      (window as unknown as { __CVKU__: unknown }).__CVKU__ = d;
    }, payload as never);
    const res = await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
    if (!res?.ok()) throw new Error(`halaman render ${res?.status()}`);
    await page.waitForSelector("body[data-ready='1']", { timeout: 15_000 });
    await page.evaluate(() => document.fonts.ready);
    return await capture(page);
  } finally {
    await browser.close();
  }
}
