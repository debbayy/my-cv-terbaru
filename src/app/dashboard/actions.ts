"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteCv(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("cvs").delete().eq("id", id); // RLS memastikan hanya milik sendiri
  revalidatePath("/dashboard");
}

export async function deleteCard(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("cards").delete().eq("id", id);
  revalidatePath("/dashboard");
}

export async function duplicateCv(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: cv } = await supabase.from("cvs").select("title,template_id,data").eq("id", id).single();
  if (!cv) return;
  const { data: copy } = await supabase
    .from("cvs")
    .insert({ user_id: user.id, title: `${cv.title} (salinan)`, template_id: cv.template_id, data: cv.data })
    .select("id")
    .single();
  revalidatePath("/dashboard");
  if (copy) redirect(`/editor/${copy.id}`);
}
