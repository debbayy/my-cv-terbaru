import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CardPreview from "@/components/card-editor/CardPreview";
import { CARD_TEMPLATES } from "@/lib/card-templates";
import { OCCASIONS, type Occasion } from "@/lib/card";

export const metadata: Metadata = {
  title: "Kartu Ucapan — CVku",
  description: "Bikin kartu ucapan ulang tahun, lebaran, pernikahan, wisuda, dan lainnya. Siap kirim ke WhatsApp.",
};

export default function KartuGallery() {
  const groups = (Object.keys(OCCASIONS) as Occasion[])
    .map((o) => ({ o, items: CARD_TEMPLATES.filter((t) => t.occasion === o) }))
    .filter((g) => g.items.length);

  return (
    <>
      <Navbar />
      <main className="pb-safe mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Kartu ucapan</h1>
        <p className="mt-2 max-w-xl text-muted">
          Pilih desain, ganti teksnya, lalu download PNG untuk WhatsApp/Instagram atau PDF untuk dicetak. Nggak perlu daftar untuk mencoba.
        </p>

        <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {groups.map((g) => (
            <a key={g.o} href={`#${g.o}`} className="shrink-0 whitespace-nowrap rounded-full border border-line bg-white px-3 py-1 text-sm hover:border-brand">
              {OCCASIONS[g.o]}
            </a>
          ))}
        </nav>

        {groups.map((g) => (
          <section key={g.o} id={g.o} className="mt-10 scroll-mt-20">
            <h2 className="text-xl font-bold">{OCCASIONS[g.o]}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {g.items.map((t) => (
                <a key={t.id} href={`/kartu/new?template=${t.id}`} className="group block">
                  <div className="pointer-events-none overflow-hidden rounded-xl shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg">
                    <CardPreview data={t.defaults} templateId={t.id} />
                  </div>
                  <p className="mt-2 font-semibold">{t.name}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
