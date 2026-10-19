"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-04L2S1BZ9C";

// Halaman yang dirender Puppeteer untuk PDF/PNG — jangan dihitung sebagai pengunjung
const EXCLUDED = ["/print", "/print-card"];

export default function GoogleAnalytics() {
  const pathname = usePathname() ?? "";
  if (!GA_ID || EXCLUDED.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
