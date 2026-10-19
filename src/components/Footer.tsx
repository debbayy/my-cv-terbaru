import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="pb-safe border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:justify-between">
        <div>
          <p className="font-display text-xl font-bold">CV<span className="text-brand">ku</span></p>
          <p className="mt-1 max-w-xs text-sm text-muted">Bikin CV ATS-friendly dan kartu ucapan, siap download dalam hitungan menit.</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          <Link href="/#template" className="text-muted hover:text-ink">Template CV</Link>
          <Link href="/syarat" className="text-muted hover:text-ink">Syarat & Ketentuan</Link>
          <Link href="/kartu" className="text-muted hover:text-ink">Kartu Ucapan</Link>
          <Link href="/privasi" className="text-muted hover:text-ink">Kebijakan Privasi</Link>
          <Link href="/pricing" className="text-muted hover:text-ink">Harga</Link>
          <Link href="/refund" className="text-muted hover:text-ink">Kebijakan Refund</Link>
          <Link href="/kontak" className="text-muted hover:text-ink">Kontak</Link>
        </nav>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} {SITE.name}. Pembayaran diproses oleh Midtrans.</p>
    </footer>
  );
}
