import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isPro, PLANS } from "@/lib/plans";
import Bayar from "./Bayar";

export const metadata: Metadata = { title: "Pembayaran — CVku" };
export const dynamic = "force-dynamic";

const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard");

export default async function BayarPage({ searchParams }: { searchParams: Promise<{ next?: string; order?: string }> }) {
  const { next: rawNext, order } = await searchParams;
  const next = safeNext(rawNext);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/bayar?next=${encodeURIComponent(next)}`)}&reason=download`);

  const { data: profile } = await supabase.from("profiles").select("pro_until").eq("id", user.id).single();
  // Sudah Pro dan bukan sedang kembali dari pembayaran → langsung lanjut
  if (isPro(profile?.pro_until) && !order) redirect(next);

  return <Bayar next={next} returningOrder={order ?? null} plan={PLANS.pro_monthly} />;
}
