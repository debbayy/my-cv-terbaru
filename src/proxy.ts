import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Skip asset statis, webhook, dan halaman print (dipanggil Chromium tanpa cookie)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/webhooks|print|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"],
};
