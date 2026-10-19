import type { Metadata, Viewport } from "next";
import "./globals.css";
import { appUrl } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: "CVku — Bikin CV ATS & Kartu Ucapan Online",
  description: "Template CV ATS-friendly dan kartu ucapan. Isi gratis tanpa daftar, lihat hasilnya langsung, download PDF/PNG siap kirim.",
  keywords: ["CV ATS", "template CV", "buat CV online", "CV fresh graduate", "kartu ucapan", "kartu ulang tahun", "kartu lebaran"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "CVku",
    title: "CVku — Bikin CV ATS & Kartu Ucapan Online",
    description: "Isi gratis tanpa daftar. Download PDF ATS-friendly & kartu ucapan PNG siap kirim WhatsApp.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // aman untuk notch iPhone
  themeColor: "#f6f3ee",
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:wght@600;700&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>{children}</body>
    </html>
  );
}
