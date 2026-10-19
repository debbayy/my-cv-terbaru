import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Token sekali pakai berumur pendek supaya Chromium (tanpa cookie login)
 * bisa membuka /print/[id]. Tanpa token valid, halaman print menolak.
 */
const secret = () => {
  const s = process.env.PRINT_SECRET;
  if (!s || s.length < 32) throw new Error("PRINT_SECRET belum di-set (min 32 karakter)");
  return s;
};

export function signPrintToken(cvId: string, ttlSeconds = 60) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const sig = createHmac("sha256", secret()).update(`${cvId}.${exp}`).digest("base64url");
  return `${exp}.${sig}`;
}

export function verifyPrintToken(cvId: string, token: string | undefined | null) {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now() / 1000) return false;
  const expected = createHmac("sha256", secret()).update(`${cvId}.${exp}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
