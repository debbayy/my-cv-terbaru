import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeCard } from "@/lib/card";
import { getCardTemplate } from "@/lib/card-templates";
import { getAccess } from "@/lib/access";
import CardEditor from "@/components/card-editor/CardEditor";

export default async function KartuEditorPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>; searchParams: Promise<{ download?: string }>;
}) {
  const { id } = await params;
  const { download } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/kartu/${id}`);

  const [{ data: card }, access] = await Promise.all([
    supabase.from("cards").select("id,template_id,data").eq("id", id).single(),
    getAccess(supabase, user.id),
  ]);
  if (!card) notFound();
  const t = getCardTemplate(card.template_id);

  return (
    <CardEditor
      id={card.id}
      initialTemplate={t.id}
      initialData={normalizeCard(card.data, t.defaults)}
      access={access}
      autoDownload={download === "png" || download === "pdf" ? download : null}
    />
  );
}
