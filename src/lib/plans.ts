export type PlanId = "pro_monthly";

export const PLANS: Record<PlanId, { id: PlanId; name: string; price: number; days: number; tagline: string }> = {
  pro_monthly: {
    id: "pro_monthly",
    name: "Pro 30 Hari",
    price: 50_000,
    days: 30,
    tagline: "Download PDF tanpa batas selama 30 hari",
  },
  // Contoh tambah paket sekali pakai:
  // pro_weekly: { id: "pro_weekly", name: "Pro 7 Hari", price: 20_000, days: 7, tagline: "..." },
};

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const isPro = (proUntil: string | null | undefined) =>
  !!proUntil && new Date(proUntil).getTime() > Date.now();
