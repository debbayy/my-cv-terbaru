export type PlanId = "pro_monthly" | "promax_monthly";
export type Tier = "pro" | "promax";

export type Plan = { id: PlanId; tier: Tier; name: string; price: number; days: number; tagline: string };

export const PLANS: Record<PlanId, Plan> = {
  pro_monthly: {
    id: "pro_monthly",
    tier: "pro",
    name: "Pro 30 Hari",
    price: 50_000,
    days: 30,
    tagline: "Download 2 template pilihan di tiap kategori CV & kartu",
  },
  promax_monthly: {
    id: "promax_monthly",
    tier: "promax",
    name: "Pro Max 30 Hari",
    price: 99_000,
    days: 30,
    tagline: "Download SEMUA template CV & kartu ucapan tanpa batas",
  },
};

export const planForTier = (t: Tier) => (t === "promax" ? PLANS.promax_monthly : PLANS.pro_monthly);

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const isPro = (until: string | null | undefined) => !!until && new Date(until).getTime() > Date.now();
