import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/editor", "/claim"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });


  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  const path = request.nextUrl.pathname;

  if (!data.user && PROTECTED.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(path + request.nextUrl.search)}${path === "/claim" ? "&reason=download" : ""}`;
    return NextResponse.redirect(url);
  }

  return response;
}
