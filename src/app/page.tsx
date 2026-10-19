import Navbar from "@/components/Navbar";
import CvPreview from "@/components/editor/CvPreview";
import { sampleCv } from "@/lib/cv";
import { TEMPLATES } from "@/lib/templates";
import { PLANS, rupiah } from "@/lib/plans";
import Link from "next/link";

export default function Home() {
  const sample = sampleCv();
  const pro = PLANS.pro_monthly;

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 md:grid-cols-[1.1fr_1fr] md:pt-20">
          <div>
            <p className="mb-4 inline-block rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
              Template gratis · Lihat hasilnya langsung
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              CV yang <em className="text-brand not-italic underline decoration-gold decoration-4 underline-offset-4">terbaca</em> sistem ATS, selesai dalam 10 menit.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Banyak CV gugur sebelum dibaca HRD karena formatnya nggak bisa dibaca mesin. Isi datamu, pilih template, download PDF berbasis teks yang lolos screening.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/new?template=ats-classic" className="btn-primary px-6 py-3 text-base">Buat CV Gratis</a>
              <Link href="#template" className="btn-ghost px-6 py-3 text-base">Lihat Template</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm md:rotate-[1.5deg]">
            <CvPreview data={sample} templateId="ats-modern" />
          </div>
        </section>

        {/* KENAPA */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
            {[
              ["PDF berbasis teks", "Bukan screenshot. Setiap kata bisa dibaca dan dicari oleh ATS."],
              ["Struktur yang dikenali", "Judul bagian standar, satu kolom, tanpa tabel yang membingungkan parser."],
              ["Edit kapan saja", "CV tersimpan di akunmu. Ganti template tanpa ketik ulang."],
            ].map(([t, d]) => (
              <div key={t}>
                <h3 className="font-display text-xl font-bold">{t}</h3>
                <p className="mt-1 text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEMPLATE */}
        <section id="template" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16">
          <h2 className="font-display text-3xl font-bold">Pilih template</h2>
          <p className="mt-1 text-muted">Semua template gratis dipakai dan diedit.</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <a key={t.id} href={`/new?template=${t.id}`} className="group block">
                <div className="overflow-hidden rounded-xl border border-line bg-white p-4 transition group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="pointer-events-none max-h-[360px] overflow-hidden">
                    <CvPreview data={sample} templateId={t.id} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <h3 className="font-semibold">{t.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.ats ? "bg-brand/10 text-brand" : "bg-gold/25 text-ink"}`}>
                    {t.ats ? "ATS-friendly" : "Desain bebas"}
                  </span>
                </div>
                <p className="text-sm text-muted">{t.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* CTA HARGA */}
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-dark p-8 text-white md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold">Edit gratis. Download mulai {rupiah(pro.price)}.</h2>
              <p className="mt-1 text-white/70">{pro.tagline}. Bayar via QRIS, e-wallet, atau transfer bank.</p>
            </div>
            <Link href="/pricing" className="btn-gold px-6 py-3 text-base">Lihat Paket Pro</Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-muted">© {new Date().getFullYear()} CVku</footer>
    </>
  );
}
