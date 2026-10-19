import { isPro, type Tier } from "@/lib/plans";

/** Hak download user. Pro Max otomatis mencakup Pro. */
export type Access = { pro: boolean; promax: boolean; proUntil: string | null; promaxUntil: string | null };

export const NO_ACCESS: Access = { pro: false, promax: false, proUntil: null, promaxUntil: null };

export const canDownload = (tier: Tier, a: Access) => (tier === "promax" ? a.promax : a.pro || a.promax);

export const accessFrom = (p: { pro_until?: string | null; promax_until?: string | null } | null | undefined): Access => {
  const promax = isPro(p?.promax_until);
  return {
    pro: isPro(p?.pro_until) || promax,
    promax,
    proUntil: p?.pro_until ?? null,
    promaxUntil: p?.promax_until ?? null,
  };
};

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
  const r = await sb.from("profiles").select("pro_until,promax_until").eq("id", userId).single();
  if (!r.error) return accessFrom(r.data as { pro_until: string | null; promax_until: string | null });
  const r2 = await sb.from("profiles").select("pro_until").eq("id", userId).single();
  return accessFrom(r2.data as { pro_until: string | null } | null);
}
