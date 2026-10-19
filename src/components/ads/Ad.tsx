import { createClient } from "@/lib/supabase/server";
import { getAccess, NO_ACCESS, showAds } from "@/lib/access";
import AdSlot from "./AdSlot";

/** Server wrapper: tampilkan iklan hanya untuk pengunjung/akun tanpa paket. */
export default async function Ad({ placement, className }: { placement?: string; className?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const access = user ? await getAccess(supabase, user.id) : NO_ACCESS;
  if (!showAds(access)) return null;
  return <AdSlot placement={placement} className={className} />;
}
