/**
 * Konfigurasi publik — aman ada di kode (nilai yang sama juga terlihat di browser).
 * Env di Vercel tetap diutamakan kalau di-set.
 *
 * Yang RAHASIA (service role key, Midtrans server key) TIDAK boleh ada di sini.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hrylewsxcdxwyeeqlhhk.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_VzlHqObvyV9PUXPl2BOIkg_MJF3SAbt";

/** URL publik app. Di Vercel otomatis diambil dari domain production. */
export function appUrl(fallbackOrigin?: string) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return fallbackOrigin ?? "http://localhost:3000";
}
