import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pb-safe mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-muted">Terakhir diperbarui: {SITE.updated}</p>
        <div className="legal mt-8 space-y-4 leading-relaxed">{children}</div>
      </main>
      <Footer />
    </>
  );
}
