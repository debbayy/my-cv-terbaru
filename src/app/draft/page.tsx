import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAccess, NO_ACCESS } from "@/lib/access";
import GuestEditor from "./GuestEditor";

export const metadata: Metadata = { title: "Buat CV — CVku" };

/** Editor untuk tamu: tidak perlu login. Draft disimpan di browser. */
export default async function DraftPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const access = user ? await getAccess(supabase, user.id) : NO_ACCESS;
  return <GuestEditor template={template} access={access} />;
}
