import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { rupiah } from "@/lib/plans";
import { getAccess, showAds } from "@/lib/access";
import AdSlot from "@/components/ads/AdSlot";
import SubmitButton from "@/components/ui/SubmitButton";
import SignOutButton from "@/components/ui/SignOutButton";
import LoadingLink from "@/components/ui/LoadingLink";
import { deleteCard, deleteCv, duplicateCv } from "./actions";
import { getCardTemplate } from "@/lib/card-templates";
import { OCCASIONS } from "@/lib/card";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ paid?: string }> }) {
  const { paid } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: cvs }, access, { data: cards }, { data: pays }] = await Promise.all([
    supabase.from("cvs").select("id,title,template_id,updated_at").order("updated_at", { ascending: false }),
    getAccess(supabase, user.id),
    supabase.from("cards").select("id,title,template_id,updated_at").order("updated_at", { ascending: false }),
    supabase.from("payments").select("order_id,amount,status,paid_at,created_at").eq("status", "paid").order("created_at", { ascending: false }).limit(10),
  ]);
  const pro = access.pro;
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
                access.promax ? (
                  <>Pro Max aktif sampai <strong>{fmt(access.promaxUntil!)}</strong> — semua template terbuka</>
                ) : (
                  <>Pro aktif sampai <strong>{fmt(access.proUntil!)}</strong> · <Link href="/pricing" className="font-semibold text-brand">Upgrade ke Pro Max</Link> untuk semua template</>
                )
              ) : (
                <>
                  Akun gratis · {access.freeLeft > 0 ? "sisa 1x download gratis CV ATS" : "jatah download gratis sudah terpakai"} ·{" "}
                  <Link href="/pricing" className="font-semibold text-brand">Upgrade, tanpa iklan</Link>
                </>
              )}
            </p>
          </div>
          <SignOutButton className="text-sm text-muted hover:text-ink" />
        </div>

        {showAds(access) && <AdSlot placement="dashboard" className="mb-8" />}

        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Mulai CV baru</h2>
        <div className="mb-10 flex flex-wrap gap-2 sm:gap-3">
          {TEMPLATES.map((t) => (
            <LoadingLink key={t.id} href={`/new?template=${t.id}`} className="btn-ghost">
              + {t.name}
            </LoadingLink>
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
                <form action={duplicateCv}>
                  <input type="hidden" name="id" value={cv.id} />
                  <SubmitButton pendingText="Menyalin…" className="text-sm text-muted hover:text-ink hover:underline" title="Bikin versi lain untuk lowongan berbeda">Duplikat</SubmitButton>
                </form>
                <form action={deleteCv}>
                  <input type="hidden" name="id" value={cv.id} />
                  <SubmitButton pendingText="Menghapus…" confirm="Hapus permanen? Tindakan ini tidak bisa dibatalkan." className="text-sm text-red-600 hover:underline">Hapus</SubmitButton>
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
                    <SubmitButton pendingText="Menghapus…" confirm="Hapus permanen? Tindakan ini tidak bisa dibatalkan." className="text-sm text-red-600 hover:underline">Hapus</SubmitButton>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
        {!!pays?.length && (
          <>
            <h2 className="mb-3 mt-12 text-sm font-semibold uppercase tracking-wider text-muted">Riwayat pembayaran</h2>
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white text-sm">
              {pays.map((p) => (
                <li key={p.order_id} className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
                  <div className="min-w-0">
                    <p className="font-semibold">{p.amount >= 99_000 ? "Pro Max" : "Pro"} 30 Hari · {rupiah(p.amount)}</p>
                    <p className="truncate font-mono text-xs text-muted">{p.order_id}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{fmt(p.paid_at ?? p.created_at)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">Ada kendala? Lihat <Link href="/kontak" className="underline">Kontak</Link> atau <Link href="/refund" className="underline">Kebijakan Refund</Link>.</p>
          </>
        )}
      </main>
    </>
  );
}
