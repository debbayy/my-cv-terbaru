import { isPro, type Tier } from "@/lib/plans";

/** Hak download user. Pro Max otomatis mencakup Pro. */
export type Access = {
  pro: boolean;
  promax: boolean;
  proUntil: string | null;
  promaxUntil: string | null;
  /** Sisa download gratis (khusus CV ATS). */
  freeLeft: number;
};

/** Jumlah download gratis untuk akun tanpa paket. */
export const FREE_DOWNLOADS = 1;

export const NO_ACCESS: Access = { pro: false, promax: false, proUntil: null, promaxUntil: null, freeLeft: 0 };

export const canDownload = (tier: Tier, a: Access) => (tier === "promax" ? a.promax : a.pro || a.promax);

type Row = { pro_until?: string | null; promax_until?: string | null; free_downloads_used?: number | null };

export const accessFrom = (p: Row | null | undefined): Access => {
  const promax = isPro(p?.promax_until);
  const pro = isPro(p?.pro_until) || promax;
  // Kolom belum ada (migration-004 belum jalan) → anggap kuota gratis tidak tersedia
  const used = typeof p?.free_downloads_used === "number" ? p.free_downloads_used : FREE_DOWNLOADS;
  return {
    pro,
    promax,
    proUntil: p?.pro_until ?? null,
    promaxUntil: p?.promax_until ?? null,
    freeLeft: pro ? 0 : Math.max(0, FREE_DOWNLOADS - used),
  };
};

/** Boleh pakai kuota gratis untuk template ini? (hanya CV ATS, akun tanpa paket) */
export const canUseFree = (isAtsCv: boolean, a: Access) => isAtsCv && !a.pro && a.freeLeft > 0;

/** Tampilkan iklan? Hanya untuk yang tidak berlangganan. */
export const showAds = (a: Access) => !a.pro;

type SB = {
  from: (t: string) => {
    select: (c: string) => { eq: (k: string, v: string) => { single: () => PromiseLike<{ data: unknown; error: unknown }> } };
  };
};

/**
 * Ambil akses user. Kalau kolom promax_until belum ada (migration-003 belum dijalankan),
 * tetap jalan dengan pro_until saja supaya user Pro lama tidak terkunci.
 */
export async function getAccess(supabase: unknown, userId: string): Promise<Access> {
  const sb = supabase as SB;
  const r0 = await sb.from("profiles").select("pro_until,promax_until,free_downloads_used").eq("id", userId).single();
  if (!r0.error) return accessFrom(r0.data as Row);
  const r = await sb.from("profiles").select("pro_until,promax_until").eq("id", userId).single();
  if (!r.error) return accessFrom(r.data as Row);
  const r2 = await sb.from("profiles").select("pro_until").eq("id", userId).single();
  return accessFrom(r2.data as Row | null);
}
