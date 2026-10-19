import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { isPro } from "@/lib/plans";
import { deleteCv } from "./actions";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ paid?: string }> }) {
  const { paid } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: cvs }, { data: profile }] = await Promise.all([
    supabase.from("cvs").select("id,title,template_id,updated_at").order("updated_at", { ascending: false }),
    supabase.from("profiles").select("pro_until").eq("id", user.id).single(),
  ]);
  const pro = isPro(profile?.pro_until);
  const fmt = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
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
        <div className="mb-10 flex flex-wrap gap-3">
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
              <li key={cv.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <Link href={`/editor/${cv.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{cv.title}</p>
                  <p className="text-xs text-muted">
                    {getTemplate(cv.template_id).name} · diubah {fmt(cv.updated_at)}
                  </p>
                </Link>
                <Link href={`/editor/${cv.id}`} className="btn-ghost py-1.5">Edit</Link>
                <form action={deleteCv}>
                  <input type="hidden" name="id" value={cv.id} />
                  <button className="text-sm text-red-600 hover:underline">Hapus</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
