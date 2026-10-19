import { SUPABASE_URL } from "@/lib/config";
import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Service-role client: BYPASS RLS. Hanya untuk webhook & generate PDF. Jangan pernah diimport ke client. */
export function createAdminClient() {
  return createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
