"use client";
import { useState } from "react";
import Spinner from "./Spinner";

/** Keluar akun (POST native ke /auth/signout) dengan indikator loading. */
export default function SignOutButton({ className = "" }: { className?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <form action="/auth/signout" method="post" onSubmit={(e) => { if (busy) e.preventDefault(); else setBusy(true); }}>
      <button type="submit" disabled={busy} aria-busy={busy} className={`inline-flex items-center gap-1.5 whitespace-nowrap disabled:opacity-60 ${className}`}>
        {busy && <Spinner className="h-3.5 w-3.5" />}
        {busy ? "Keluar…" : "Keluar"}
      </button>
    </form>
  );
}
