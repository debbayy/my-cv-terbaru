import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { isPro } from "@/lib/plans";
import { deleteCard, deleteCv } from "./actions";
import { getCardTemplate } from "@/lib/card-templates";
import { OCCASIONS } from "@/lib/card";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ paid?: string }> }) {
  const { paid } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: cvs }, { data: profile }, { data: cards }] = await Promise.all([
    supabase.from("cvs").select("id,title,template_id,updated_at").order("updated_at", { ascending: false }),
    supabase.from("profiles").select("pro_until").eq("id", user.id).single(),
    supabase.from("cards").select("id,title,template_id,updated_at").order("updated_at", { ascending: false }),
  ]);
  const pro = isPro(profile?.pro_until);
  const fmt = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <Navbar />
      <main className="pb-safe mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-10">
        {paid && (
          <div className="mb-6 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand">
            {pro
              ? "Pembayaran berhasil 🎉 Akun Pro kamu sudah aktif."
              : "Pembayaran sedang diproses. Status Pro aktif otomatis dalam beberapa saat — refresh halaman ini."}
          </div>
        )}

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">CV Saya</h1>
            <p className="text-sm text-muted">
              {pro ? (
                <>Pro aktif sampai <strong>{fmt(profile!.pro_until!)}</strong></>
              ) : (
                <>Akun gratis · <Link href="/pricing" className="font-semibold text-brand">Upgrade ke Pro</Link> untuk download PDF</>
              )}
            </p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-muted hover:text-ink">Keluar</button>
          </form>
        </div>

        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Mulai CV baru</h2>
        <div className="mb-10 flex flex-wrap gap-2 sm:gap-3">
          {TEMPLATES.map((t) => (
            <a key={t.id} href={`/new?template=${t.id}`} className="btn-ghost">
              + {t.name}
            </a>
          ))}
        </div>

        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Tersimpan</h2>
        {!cvs?.length ? (
          <p className="rounded-xl border border-dashed border-line p-10 text-center text-muted">Belum ada CV. Pilih template di atas untuk mulai.</p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            {cvs.map((cv) => (
              <li key={cv.id} className="flex items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-4">
                <Link href={`/editor/${cv.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{cv.title}</p>
                  <p className="text-xs text-muted">
                    {getTemplate(cv.template_id).name} · diubah {fmt(cv.updated_at)}
                  </p>
                </Link>
                <Link href={`/editor/${cv.id}`} className="btn-ghost hidden py-1.5 sm:inline-flex">Edit</Link>
                <form action={deleteCv}>
                  <input type="hidden" name="id" value={cv.id} />
                  <button className="text-sm text-red-600 hover:underline">Hapus</button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <div className="mb-3 mt-12 flex items-end justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Kartu ucapan</h2>
          <Link href="/kartu" className="text-sm font-semibold text-brand">+ Buat kartu</Link>
        </div>
        {!cards?.length ? (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">
            Belum ada kartu. <Link href="/kartu" className="font-semibold text-brand">Pilih desain kartu</Link>
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            {cards.map((c) => {
              const t = getCardTemplate(c.template_id);
              return (
                <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-4">
                  <Link href={`/kartu/${c.id}`} className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{c.title}</p>
                    <p className="text-xs text-muted">{OCCASIONS[t.occasion]} · {t.name} · diubah {fmt(c.updated_at)}</p>
                  </Link>
                  <Link href={`/kartu/${c.id}`} className="btn-ghost hidden py-1.5 sm:inline-flex">Edit</Link>
                  <form action={deleteCard}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-sm text-red-600 hover:underline">Hapus</button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
