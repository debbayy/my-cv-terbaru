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
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:px-4">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          CV<span className="text-brand">ku</span>
        </Link>
        <div className="flex min-w-0 items-center gap-0.5 text-[13px] sm:gap-2 sm:text-sm">
          <Link href="/#template" className="hidden px-2 py-1 text-muted hover:text-ink sm:block">Template CV</Link>
          <Link href="/kartu" className="whitespace-nowrap px-2 py-1 text-muted hover:text-ink"><span className="sm:hidden">Kartu</span><span className="hidden sm:inline">Kartu Ucapan</span></Link>
          <Link href="/pricing" className="hidden px-2 py-1 text-muted hover:text-ink min-[400px]:block">Harga</Link>
          {user ? (
            <>
              {pro && <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold">PRO</span>}
              <Link href="/dashboard" className="btn-primary whitespace-nowrap px-3 sm:px-4">Akun Saya</Link>
            </>
          ) : (
            <Link href="/login" className="btn-primary whitespace-nowrap px-3 sm:px-4">Masuk</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
