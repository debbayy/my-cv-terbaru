import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Token sekali pakai berumur pendek supaya Chromium (tanpa cookie login)
 * bisa membuka /print/[id]. Tanpa token valid, halaman print menolak.
 */
// PRINT_SECRET opsional: kalau kosong, diturunkan dari service role key (tetap rahasia, tidak perlu env tambahan)
const secret = () => {
  const s = process.env.PRINT_SECRET;
  if (s && s.length >= 32) return s;
  const base = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base) throw new Error("SUPABASE_SERVICE_ROLE_KEY belum di-set");
  return createHmac("sha256", base).update("cvku-print-token").digest("hex");
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
