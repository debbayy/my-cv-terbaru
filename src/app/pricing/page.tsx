import PendingLink from "@/components/ui/PendingLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { FREE_MODE, getAccess, NO_ACCESS } from "@/lib/access";
import { PLANS, rupiah } from "@/lib/plans";
import { TEMPLATES } from "@/lib/templates";
import { CARD_TEMPLATES } from "@/lib/card-templates";

export const metadata = { title: "Harga — CVku" };

const fmt = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default async function Pricing() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const access = user ? await getAccess(supabase, user.id) : NO_ACCESS;
  const pro = PLANS.pro_monthly;
  const max = PLANS.promax_monthly;

  const cvPro = TEMPLATES.filter((t) => t.tier === "pro").length;
  const cardPro = CARD_TEMPLATES.filter((t) => t.tier === "pro").length;
  const href = (plan: string) => {
    const target = `/bayar?plan=${plan}&next=${encodeURIComponent("/dashboard")}`;
    return user ? target : `/login?next=${encodeURIComponent(target)}`;
  };

  return (
    <>
      <Navbar />
      <main className="pb-safe mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="font-display text-center text-3xl font-bold sm:text-4xl">Harga simpel</h1>
        <p className="mt-2 text-center text-muted">Isi dan preview semua template selalu gratis. Coba download CV ATS gratis 1x.</p>

        {FREE_MODE && (
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-center text-sm text-brand">
            🎉 <strong>Gratis untuk sementara!</strong> Semua template CV dan kartu ucapan bisa di-download tanpa bayar dan tanpa iklan. Paket di bawah akan berlaku nanti.
          </div>
        )}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* GRATIS */}
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
            <h2 className="text-lg font-bold">Gratis</h2>
            <p className="font-display mt-2 text-4xl font-bold">Rp0</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ Isi & preview semua {TEMPLATES.length} template CV</li>
              <li>✓ Isi & preview semua {CARD_TEMPLATES.length} kartu ucapan</li>
              <li>✓ <strong>1x download gratis</strong> khusus CV ATS</li>
              <li>✓ Simpan di akun</li>
              <li className="text-muted">✗ Download kartu & CV desain bebas</li>
              <li className="text-muted">✗ Ada iklan</li>
            </ul>
          </div>

          {/* PRO */}
          <div className="rounded-2xl border-2 border-brand bg-white p-6 sm:p-7">
            <h2 className="text-lg font-bold">Pro</h2>
            <p className="font-display mt-2 text-4xl font-bold">
              {rupiah(pro.price)} <span className="font-sans text-base font-normal text-muted">/ {pro.days} hari</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ Download <strong>2 template pilihan per kategori</strong></li>
              <li>✓ {cvPro} template CV (ATS & desain bebas)</li>
              <li>✓ {cardPro} kartu ucapan untuk semua acara</li>
              <li>✓ PDF tanpa watermark, terbaca ATS</li>
              <li>✓ Download tanpa batas jumlah</li>
              <li>✓ <strong>Tanpa iklan</strong></li>
            </ul>
            <PendingLink href={href(pro.id)} className="btn-primary mt-7 w-full py-3 text-base">
              {access.pro && !access.promax ? "Perpanjang Pro" : "Pilih Pro"}
            </PendingLink>
            {access.pro && !access.promax && access.proUntil && (
              <p className="mt-3 text-center text-xs text-muted">Pro aktif sampai {fmt(access.proUntil)}</p>
            )}
          </div>

          {/* PRO MAX */}
          <div className="relative rounded-2xl bg-brand-dark p-6 text-white sm:p-7">
            <span className="absolute -top-3 right-6 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">TERLENGKAP</span>
            <h2 className="text-lg font-bold">Pro Max</h2>
            <p className="font-display mt-2 text-4xl font-bold">
              {rupiah(max.price)} <span className="font-sans text-base font-normal text-white/60">/ {max.days} hari</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ Download <strong>SEMUA template</strong></li>
              <li>✓ {TEMPLATES.length} template CV, termasuk koleksi ★ Pro Max</li>
              <li>✓ {CARD_TEMPLATES.length} kartu ucapan, semua desain</li>
              <li>✓ Template baru otomatis ikut terbuka</li>
              <li>✓ <strong>Tanpa iklan</strong> · semua fitur Pro</li>
            </ul>
            <PendingLink href={href(max.id)} className="btn-gold mt-7 w-full py-3 text-base">
              {access.promax ? "Perpanjang Pro Max" : "Pilih Pro Max"}
            </PendingLink>
            {access.promax && access.promaxUntil && (
              <p className="mt-3 text-center text-xs text-white/70">Pro Max aktif sampai {fmt(access.promaxUntil)}</p>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Sekali bayar, tidak perpanjang otomatis. Bayar via QRIS (semua e-wallet & m-banking), GoPay, Virtual Account, atau kartu.
        </p>
      </main>
      <Footer />
    </>
  );
}
