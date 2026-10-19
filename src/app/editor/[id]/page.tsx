import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeCv } from "@/lib/cv";
import { getAccess } from "@/lib/access";
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

  const [{ data: cv }, access] = await Promise.all([
    supabase.from("cvs").select("id,title,template_id,data").eq("id", id).single(),
    getAccess(supabase, user.id),
  ]);
  if (!cv) notFound();

  return (
    <Editor
      id={cv.id}
      initialTitle={cv.title}
      initialTemplate={cv.template_id}
      initialData={normalizeCv(cv.data)}
      access={access}
      autoDownload={download === "1"}
    />
  );
}
