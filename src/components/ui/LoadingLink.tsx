"use client";
import { useState } from "react";
import Spinner from "./Spinner";

/**
 * Link ke route handler (mis. /new?template=…) yang membuat data dulu. Klik kedua diabaikan.
 * `overlay`: untuk kartu/thumbnail — spinner menutupi seluruh area, bukan sebaris dengan teks.
 */
export default function LoadingLink({
  href, children, className = "", overlay = false,
}: { href: string; children: React.ReactNode; className?: string; overlay?: boolean }) {
  const [busy, setBusy] = useState(false);
  return (
    <a
      href={href}
      aria-busy={busy}
      aria-disabled={busy}
      onClick={(e) => { if (busy) e.preventDefault(); else setBusy(true); }}
      className={`${className} ${overlay ? "relative" : ""} ${busy && !overlay ? "pointer-events-none opacity-60" : ""}`}
    >
      {busy && !overlay && <Spinner className="h-3.5 w-3.5" />}
      {children}
      {busy && overlay && (
        <span className="absolute inset-0 z-10 grid place-items-center rounded-[inherit] bg-white/70 text-brand backdrop-blur-[1px]">
          <Spinner className="h-7 w-7" />
        </span>
      )}
    </a>
  );
}
