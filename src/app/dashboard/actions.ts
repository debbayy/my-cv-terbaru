"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteCv(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("cvs").delete().eq("id", id); // RLS memastikan hanya milik sendiri
  revalidatePath("/dashboard");
}
