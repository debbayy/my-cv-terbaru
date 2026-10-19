import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/plans";
import GuestEditor from "./GuestEditor";

export const metadata: Metadata = { title: "Buat CV — CVku" };

/** Editor untuk tamu: tidak perlu login. Draft disimpan di browser. */
export default async function DraftPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let pro = false;
  if (user) {
    const { data } = await supabase.from("profiles").select("pro_until").eq("id", user.id).single();
    pro = isPro(data?.pro_until);
  }
  return <GuestEditor template={template} pro={pro} />;
}
