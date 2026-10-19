import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/plans";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let pro = false;
  if (user) {
    const { data } = await supabase.from("profiles").select("pro_until").eq("id", user.id).single();
    pro = isPro(data?.pro_until);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          CV<span className="text-brand">ku</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/#template" className="hidden px-2 py-1 text-muted hover:text-ink sm:block">Template</Link>
          <Link href="/pricing" className="px-2 py-1 text-muted hover:text-ink">Harga</Link>
          {user ? (
            <>
              {pro && <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold">PRO</span>}
              <Link href="/dashboard" className="btn-primary">CV Saya</Link>
            </>
          ) : (
            <Link href="/login" className="btn-primary">Masuk</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
