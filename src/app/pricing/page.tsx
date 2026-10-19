import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { isPro, PLANS, rupiah } from "@/lib/plans";
import Link from "next/link";

export default async function Pricing() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let proUntil: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("pro_until").eq("id", user.id).single();
    proUntil = data?.pro_until ?? null;
  }
  const pro = isPro(proUntil);
  const plan = PLANS.pro_monthly;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <h1 className="font-display text-center text-3xl font-bold sm:text-4xl">Harga simpel</h1>
        <p className="mt-2 text-center text-muted">Bikin dan edit CV selalu gratis. Bayar hanya saat mau download.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
            <h2 className="text-lg font-bold">Gratis</h2>
            <p className="font-display mt-2 text-4xl font-bold">Rp0</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ Semua template</li>
              <li>✓ Editor + preview langsung</li>
              <li>✓ Simpan CV di akun</li>
              <li>✓ Desain kartu ucapan</li>
              <li className="text-muted">✗ Download CV & kartu</li>
            </ul>
          </div>

          <div className="relative rounded-2xl bg-brand-dark p-6 text-white sm:p-7">
            <span className="absolute -top-3 right-6 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">PALING DIPILIH</span>
            <h2 className="text-lg font-bold">{plan.name}</h2>
            <p className="font-display mt-2 text-4xl font-bold">
              {rupiah(plan.price)} <span className="font-sans text-base font-normal text-white/60">/ {plan.days} hari</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ Semua fitur Gratis</li>
              <li>✓ Download CV (PDF) tanpa batas & tanpa watermark</li>
              <li>✓ Download kartu ucapan (PNG & PDF)</li>
              <li>✓ PDF berbasis teks, terbaca ATS</li>
              <li>✓ Tidak perpanjang otomatis — bayar lagi kalau perlu</li>
            </ul>
            <div className="mt-7">
              <Link href={user ? "/bayar?next=/dashboard" : "/login?next=%2Fbayar%3Fnext%3D%252Fdashboard"} className="btn-gold w-full py-3 text-base">
                {pro ? "Perpanjang 30 hari lagi" : "Upgrade ke Pro"}
              </Link>
            </div>
            {pro && proUntil && (
              <p className="mt-3 text-center text-xs text-white/70">
                Pro aktif sampai {new Date(proUntil).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}. Perpanjangan ditambahkan ke sisa masa aktif.
              </p>
            )}
            <p className="mt-3 text-center text-xs text-white/60">QRIS (semua e-wallet & m-banking) · GoPay · Virtual Account · Kartu</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
