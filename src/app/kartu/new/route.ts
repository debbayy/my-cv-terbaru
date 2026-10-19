import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCardTemplate } from "@/lib/card-templates";

/** /kartu/new?template=… → tamu ke editor draft; user login langsung dibuatkan kartu di akun. */
export async function GET(req: NextRequest) {
  const t = getCardTemplate(req.nextUrl.searchParams.get("template") ?? "");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL(`/kartu/buat?template=${t.id}`, req.url));

  const { data, error } = await supabase
    .from("cards")
    .insert({ user_id: user.id, template_id: t.id, title: t.defaults.headline, data: t.defaults })
    .select("id")
    .single();
  if (error || !data) return NextResponse.redirect(new URL(`/kartu/buat?template=${t.id}`, req.url));
  return NextResponse.redirect(new URL(`/kartu/${data.id}`, req.url));
}
