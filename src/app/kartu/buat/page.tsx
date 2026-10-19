import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/plans";
import GuestCardEditor from "./GuestCardEditor";

export const metadata = { title: "Buat Kartu — CVku" };

export default async function BuatKartu({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let pro = false;
  if (user) {
    const { data } = await supabase.from("profiles").select("pro_until").eq("id", user.id).single();
    pro = isPro(data?.pro_until);
  }
  return <GuestCardEditor template={template} pro={pro} />;
}
