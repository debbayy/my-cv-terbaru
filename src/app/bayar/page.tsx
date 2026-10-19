import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAccess, canDownload } from "@/lib/access";
import { PLANS, type PlanId, type Tier } from "@/lib/plans";
import Bayar from "./Bayar";

export const metadata: Metadata = { title: "Pembayaran — CVku" };
export const dynamic = "force-dynamic";

const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard");

export default async function BayarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; order?: string; need?: string; plan?: string }>;
}) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const need: Tier = sp.need === "promax" ? "promax" : "pro";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/bayar?need=${need}&next=${encodeURIComponent(next)}`)}&reason=download`);

  const access = await getAccess(supabase, user.id);
  // Sudah punya akses yang dibutuhkan (dan bukan sedang kembali dari pembayaran) → langsung lanjut
  if (!sp.order && !sp.plan && canDownload(need, access)) redirect(next);

  const initialPlan: PlanId =
    sp.plan === "promax_monthly" || sp.plan === "pro_monthly" ? sp.plan : need === "promax" ? "promax_monthly" : "pro_monthly";

  return (
    <Bayar
      next={next}
      returningOrder={sp.order ?? null}
      plans={[PLANS.pro_monthly, PLANS.promax_monthly]}
      initialPlan={initialPlan}
      need={need}
    />
  );
}
