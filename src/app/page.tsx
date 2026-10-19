import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CvPreview from "@/components/editor/CvPreview";
import { sampleCv } from "@/lib/cv";
import { TEMPLATES } from "@/lib/templates";
import { PLANS, rupiah } from "@/lib/plans";
import Link from "next/link";
import CardPreview from "@/components/card-editor/CardPreview";
import { CARD_TEMPLATES } from "@/lib/card-templates";

export default function Home() {
  const sample = sampleCv();
  const pro = PLANS.pro_monthly;

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.1fr_1fr] md:pt-20">
          <div>
            <p className="mb-4 inline-block rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
              Template gratis · Lihat hasilnya langsung
            </p>
            <h1 className="font-display text-[2.1rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              CV yang <em className="text-brand not-italic underline decoration-gold decoration-4 underline-offset-4">terbaca</em> sistem ATS, selesai dalam 10 menit.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Banyak CV gugur sebelum dibaca HRD karena formatnya nggak bisa dibaca mesin. Isi datamu, pilih template, download PDF berbasis teks yang lolos screening.
            </p>
            <div className="mt-7 grid gap-3 min-[420px]:flex min-[420px]:flex-wrap">
              <a href="/new?template=ats-classic" className="btn-primary px-6 py-3 text-base">Buat CV Gratis</a>
              <Link href="#template" className="btn-ghost px-6 py-3 text-base">Lihat Template</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[300px] sm:max-w-sm md:rotate-[1.5deg]">
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
          <p className="mt-1 text-muted">Langsung isi tanpa daftar. Login cuma saat mau download.</p>
          {[
            { title: "ATS-friendly", desc: "Untuk lamar lewat portal kerja (Jobstreet, LinkedIn, Glints, website perusahaan).", items: TEMPLATES.filter((t) => t.ats) },
            { title: "Desain bebas", desc: "Untuk dikirim langsung ke HR lewat email/WhatsApp, atau portofolio.", items: TEMPLATES.filter((t) => !t.ats) },
          ].map((g) => (
            <div key={g.title} className="mt-10">
              <h3 className="text-lg font-bold">{g.title}</h3>
              <p className="text-sm text-muted">{g.desc}</p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                {g.items.map((t) => (
                  <a key={t.id} href={`/new?template=${t.id}`} className="group block">
                    <div className="overflow-hidden rounded-xl border border-line bg-white p-2 transition group-hover:-translate-y-1 group-hover:shadow-lg sm:p-4">
                      <div className="pointer-events-none max-h-[230px] overflow-hidden sm:max-h-[360px]">
                        <CvPreview data={sample} templateId={t.id} />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold sm:text-base">{t.name}</h4>
                      <span className="hidden text-sm font-semibold text-brand opacity-0 transition group-hover:opacity-100 lg:inline">Pakai →</span>
                    </div>
                    <p className="hidden text-sm text-muted sm:block">{t.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* KARTU UCAPAN */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand">Baru</p>
              <h2 className="font-display mt-1 text-3xl font-bold">Kartu ucapan siap kirim</h2>
              <p className="mt-2 text-muted">
                Ulang tahun, lebaran, pernikahan, wisuda, terima kasih — ganti teksnya, download PNG untuk WhatsApp/Instagram atau PDF untuk dicetak.
              </p>
              <Link href="/kartu" className="btn-primary mt-6 px-6 py-3 text-base">Lihat Kartu Ucapan</Link>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {CARD_TEMPLATES.slice(0, 8).map((t) => (
                <a key={t.id} href={`/kartu/new?template=${t.id}`} className="pointer-events-auto block overflow-hidden rounded-lg shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="pointer-events-none"><CardPreview data={t.defaults} templateId={t.id} /></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA HARGA */}
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-dark p-6 text-white sm:p-8 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Edit gratis. Download CV & kartu mulai {rupiah(pro.price)}.</h2>
              <p className="mt-1 text-white/70">{pro.tagline}. Bayar via QRIS, e-wallet, atau transfer bank.</p>
            </div>
            <Link href="/pricing" className="btn-gold px-6 py-3 text-base">Lihat Paket Pro</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
