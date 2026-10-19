import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Client Supabase yang bertindak sebagai user yang sedang login (RLS aktif). */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // dipanggil dari Server Component — refresh session ditangani proxy.ts
          }
        },
      },
    },
  );
}
