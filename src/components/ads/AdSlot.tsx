"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { ADSENSE_CLIENT, AD_SLOTS } from "@/lib/ads";

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

/**
 * Slot iklan untuk user gratis. Komponen pemanggil yang memutuskan tampil/tidak
 * (Pro & Pro Max tidak pernah melihat iklan).
 */
export default function AdSlot({ placement = "default", className = "" }: { placement?: string; className?: string }) {
  const slot = AD_SLOTS[placement] || AD_SLOTS.default;
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || pushed.current) return;
    pushed.current = true;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* adblock / belum siap */ }
  }, []);

  if (!ADSENSE_CLIENT) return <HouseAd className={className} />;

  return (
    <div className={`overflow-hidden ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-muted">Iklan</p>
      <Script
        id="adsbygoogle-js"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 100 }}
        data-ad-client={ADSENSE_CLIENT}
        {...(slot ? { "data-ad-slot": slot } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/** Pengganti iklan selama AdSense belum aktif: promo paket tanpa iklan. */
function HouseAd({ className }: { className: string }) {
  return (
    <div className={`rounded-xl border border-dashed border-line bg-white p-4 text-center ${className}`}>
      <p className="text-[10px] uppercase tracking-wider text-muted">Iklan</p>
      <p className="mt-1 text-sm font-semibold">Bosan lihat iklan? 🚫📢</p>
      <p className="text-xs text-muted">Paket Pro bebas iklan + download CV & kartu tanpa watermark.</p>
      <Link href="/pricing" className="btn-primary mt-3 py-1.5 text-xs">Lihat paket</Link>
    </div>
  );
}
