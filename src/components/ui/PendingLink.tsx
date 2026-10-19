"use client";
import Link from "next/link";
import { useState } from "react";
import Spinner from "./Spinner";

/** Link tombol ke halaman lain: spinner + klik kedua diabaikan sampai halaman tujuan terbuka. */
export default function PendingLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Link
      href={href}
      aria-busy={busy}
      aria-disabled={busy}
      onClick={(e) => { if (busy) e.preventDefault(); else setBusy(true); }}
      className={`${className} ${busy ? "pointer-events-none opacity-70" : ""}`}
    >
      {busy && <Spinner />}
      {children}
    </Link>
  );
}
