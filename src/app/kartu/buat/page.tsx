import { createClient } from "@/lib/supabase/server";
import { getAccess, NO_ACCESS } from "@/lib/access";
import GuestCardEditor from "./GuestCardEditor";

export const metadata = { title: "Buat Kartu — CVku" };

export default async function BuatKartu({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const access = user ? await getAccess(supabase, user.id) : NO_ACCESS;
  return <GuestCardEditor template={template} access={access} />;
}
