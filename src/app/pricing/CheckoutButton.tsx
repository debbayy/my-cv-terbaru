"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutButton({ plan, loggedIn, label }: { plan: string; loggedIn: boolean; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    if (!loggedIn) return router.push("/login?next=/pricing");
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.redirectUrl) window.location.href = json.redirectUrl;
    else {
      setErr("Gagal membuat pembayaran. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={go} disabled={loading} className="btn-gold w-full py-3 text-base">
        {loading ? "Mengarahkan ke pembayaran…" : label}
      </button>
      {err && <p className="mt-2 text-sm text-red-300">{err}</p>}
    </>
  );
}
