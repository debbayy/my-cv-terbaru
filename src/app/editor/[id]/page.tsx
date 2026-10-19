import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeCv } from "@/lib/cv";
import { isPro } from "@/lib/plans";
import Editor from "@/components/editor/Editor";

export default async function EditorPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>; searchParams: Promise<{ download?: string }>;
}) {
  const { id } = await params;
  const { download } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/editor/${id}`);

  const [{ data: cv }, { data: profile }] = await Promise.all([
    supabase.from("cvs").select("id,title,template_id,data").eq("id", id).single(),
    supabase.from("profiles").select("pro_until").eq("id", user.id).single(),
  ]);
  if (!cv) notFound();

  return (
    <Editor
      id={cv.id}
      initialTitle={cv.title}
      initialTemplate={cv.template_id}
      initialData={normalizeCv(cv.data)}
      pro={isPro(profile?.pro_until)}
      autoDownload={download === "1"}
    />
  );
}
