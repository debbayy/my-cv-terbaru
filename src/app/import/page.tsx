import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImportClient from "./ImportClient";

export const metadata: Metadata = {
  title: "Upload CV Lama — CVku",
  description: "Upload CV lama (PDF/DOCX), data langsung terisi otomatis ke template CVku.",
};

export default function ImportPage() {
  return (
    <>
      <Navbar />
      <main className="pb-safe mx-auto max-w-xl px-4 py-10 sm:py-14">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Sudah punya CV? Upload aja.</h1>
        <p className="mt-2 text-muted">
          Kami baca CV lama kamu dan mengisi semua datanya otomatis: data diri, pengalaman, pendidikan, keahlian. Tinggal pilih template dan rapikan.
        </p>
        <ImportClient />
        <ul className="mt-8 space-y-2 text-sm text-muted">
          <li>🔒 File tidak disimpan di server, hanya dibaca untuk mengambil teksnya.</li>
          <li>📑 Pakai PDF/DOCX asli, bukan hasil scan atau foto, supaya teksnya bisa dibaca.</li>
          <li>✏️ Hasil bacaan adalah tebakan terbaik. Kamu bisa mengoreksi semuanya di editor.</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
