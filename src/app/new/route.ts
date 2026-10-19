import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sampleCv } from "@/lib/cv";
import { getTemplate } from "@/lib/templates";

/** /new?template=ats-classic → buat CV baru (berisi contoh) lalu buka editor. */
export async function GET(req: NextRequest) {
  const templateId = getTemplate(req.nextUrl.searchParams.get("template") ?? "").id;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const next = `/new?template=${templateId}`;
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, req.url));
  }

  const { data, error } = await supabase
    .from("cvs")
    .insert({ user_id: user.id, template_id: templateId, title: "CV Baru", data: sampleCv() })
    .select("id")
    .single();

  if (error || !data) return NextResponse.redirect(new URL("/dashboard?error=create", req.url));
  return NextResponse.redirect(new URL(`/editor/${data.id}`, req.url));
}
