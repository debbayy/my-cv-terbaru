import type { Metadata, Viewport } from "next";
import "./globals.css";
import { appUrl } from "@/lib/config";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
      </head>
      <body>
        {children}
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
