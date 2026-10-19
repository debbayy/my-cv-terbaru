import "server-only";
import type { Browser } from "puppeteer-core";

/**
 * - Di Vercel/serverless: pakai @sparticuz/chromium (binary kecil untuk Lambda).
 * - Lokal: pakai puppeteer biasa (download Chrome otomatis saat `npm i`).
 */
export async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const puppeteer = await import("puppeteer");
  return puppeteer.launch({ headless: true, args: ["--no-sandbox"] }) as unknown as Browser;
}
