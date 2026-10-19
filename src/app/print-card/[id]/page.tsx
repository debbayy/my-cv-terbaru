import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPrintToken } from "@/lib/print-token";
import { normalizeCard } from "@/lib/card";
import { getCardTemplate } from "@/lib/card-templates";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/** Hanya dibuka Chromium server-side dengan token 60 detik. */
export default async function PrintCard({
  params, searchParams,
}: {
  params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  if (!verifyPrintToken(`card:${id}`, token)) notFound();

  const { data: card } = await createAdminClient().from("cards").select("template_id,data").eq("id", id).single();
  if (!card) notFound();
  const t = getCardTemplate(card.template_id);
  return <t.Component data={normalizeCard(card.data, t.defaults)} />;
}
