"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { rupiah } from "@/lib/plans";
import { saveBlob } from "@/lib/save-blob";

import type { Plan, PlanId, Tier } from "@/lib/plans";
type Phase = "creating" | "waiting" | "paid" | "expired" | "error";

export default function Bayar({
  next, returningOrder, plans, initialPlan, need,
}: {
  next: string; returningOrder: string | null; plans: Plan[]; initialPlan: PlanId; need: Tier;
}) {
  const router = useRouter();
  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const plan = plans.find((p) => p.id === planId) ?? plans[0];
  const [phase, setPhase] = useState<Phase>(returningOrder ? "waiting" : "creating");
  const [orderId, setOrderId] = useState<string | null>(returningOrder);
  const [qr, setQr] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [left, setLeft] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const started = useRef(false);

  useEffect(() => setMobile(matchMedia("(pointer: coarse)").matches), []);

  const charge = useCallback(async (method: "qris" | "gopay" | "snap") => {
    setErr(null);
    setBusy(method);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id, method, next }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "gagal");
      setOrderId(j.orderId);
      if (method === "snap" && j.redirectUrl) return void (window.location.href = j.redirectUrl);
      if (method === "gopay" && j.deeplink) return void (window.location.href = j.deeplink);
      if (j.qrString) setQr(await QRCode.toDataURL(j.qrString, { width: 560, margin: 1, errorCorrectionLevel: "M" }));
      else if (j.qrUrl) setQr(j.qrUrl);
      setExpiresAt(j.expiresAt ? new Date(j.expiresAt.replace(" ", "T") + "+07:00").getTime() : Date.now() + 15 * 60_000);
      setPhase("waiting");
    } catch {
      setErr("Gagal membuat pembayaran. Coba lagi sebentar, atau pilih metode lain.");
      setPhase("error");
    } finally {
      setBusy(null);
    }
  }, [plan.id, next]);

  // Langsung buat QRIS begitu halaman dibuka — tanpa klik tambahan. Ganti paket → QR baru.
  useEffect(() => {
    if (returningOrder && !started.current) { started.current = true; return; }
    started.current = true;
    setQr(null);
    setPhase("creating");
    charge("qris");
  }, [charge, returningOrder]);

  // Polling status tiap 2 detik
  useEffect(() => {
    if (!orderId || phase !== "waiting") return;
    let stop = false;
    const tick = async () => {
      try {
        const r = await fetch(`/api/payment/${encodeURIComponent(orderId)}`, { cache: "no-store" });
        const j = await r.json();
        if (stop) return;
        if (j.status === "paid") {
          setPhase("paid");
          setTimeout(() => { router.replace(next); router.refresh(); }, 1200);
          return;
        }
        if (j.status === "expired" || j.status === "failed") return setPhase("expired");
      } catch { /* jaringan putus sebentar → coba lagi */ }
      if (!stop) setTimeout(tick, 2000);
    };
    tick();
    // Cek lagi segera saat user kembali dari aplikasi e-wallet
    const onVis = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop = true; document.removeEventListener("visibilitychange", onVis); };
  }, [orderId, phase, next, router]);

  // Hitung mundur
  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => {
      const s = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) setPhase((p) => (p === "waiting" ? "expired" : p));
    }, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;

  return (
    <main className="min-h-app pb-safe mx-auto max-w-md px-4 py-6 sm:py-10">
      <Link href={next} className="text-sm text-muted hover:text-ink">← Kembali</Link>

      <div className="mt-4 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold">Pilih paket</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {plans.map((p) => {
            const locked = need === "promax" && p.tier === "pro";
            const active = p.id === planId;
            return (
              <button
                key={p.id}
                disabled={locked || phase === "paid" || !!busy}
                onClick={() => setPlanId(p.id)}
                className={`relative rounded-xl border-2 p-3 text-left transition disabled:cursor-not-allowed ${active ? "border-brand bg-brand/5" : "border-line"} ${locked ? "opacity-45" : ""}`}
              >
                {p.tier === "promax" && <span className="absolute -top-2 right-2 rounded-full bg-gold px-1.5 text-[10px] font-bold">TERLENGKAP</span>}
                <p className="text-xs font-semibold text-muted">{p.tier === "promax" ? "PRO MAX" : "PRO"}</p>
                <p className="text-lg font-bold leading-tight">{rupiah(p.price)}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted">{p.tier === "promax" ? "Semua template" : "2 template / kategori"}</p>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">
          {need === "promax"
            ? "Template yang kamu pilih termasuk koleksi Pro Max."
            : plan.tagline + "."}{" "}
          Berlaku {plan.days} hari, tidak perpanjang otomatis.
        </p>

        <div className="mt-5 border-t border-line pt-5 text-center">
          {phase === "paid" ? (
            <div className="py-8">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-3xl text-white">✓</div>
              <p className="mt-4 text-lg font-bold">Pembayaran berhasil!</p>
              <p className="text-sm text-muted">Pro aktif. Mengunduh file kamu…</p>
            </div>
          ) : phase === "creating" ? (
            <div className="py-16 text-sm text-muted">Menyiapkan QRIS…</div>
          ) : phase === "expired" ? (
            <div className="py-8">
              <p className="font-semibold">QR sudah kedaluwarsa</p>
              <button onClick={() => charge("qris")} disabled={!!busy} className="btn-primary mt-4">
                {busy ? "Membuat…" : "Buat QR baru"}
              </button>
            </div>
          ) : phase === "error" ? (
            <div className="py-6">
              <p className="text-sm text-red-700">{err}</p>
              <button onClick={() => charge("qris")} disabled={!!busy} className="btn-primary mt-4">Coba lagi</button>
            </div>
          ) : qr ? (
            <>
              <p className="text-sm font-semibold">Scan QRIS pakai e-wallet / m-banking apa saja</p>
              <p className="text-xs text-muted">GoPay, OVO, DANA, ShopeePay, LinkAja, BCA, Mandiri, BRI, dll.</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QRIS pembayaran" className="mx-auto mt-4 w-full max-w-[280px] rounded-lg border border-line" />
              <p className="mt-3 text-sm">
                Berlaku <span className="font-mono font-semibold">{mmss}</span>
              </p>
              <p className="mt-2 flex items-center justify-center gap-2 text-xs text-brand">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand" /> Menunggu pembayaran — otomatis lanjut setelah dibayar
              </p>
              {mobile && (
                <button onClick={() => saveBlob(qr, "QRIS-CVku.png")} className="btn-ghost mt-4 w-full">
                  Simpan QR ke galeri (lalu buka di aplikasi bank/e-wallet)
                </button>
              )}
            </>
          ) : (
            <div className="py-10 text-sm text-muted">
              Menunggu konfirmasi pembayaran…
              <p className="mt-2 flex items-center justify-center gap-2 text-xs text-brand">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand" /> Halaman ini otomatis lanjut setelah lunas
              </p>
            </div>
          )}
        </div>

        {phase !== "paid" && (
          <div className="mt-5 space-y-2 border-t border-line pt-5">
            {mobile && (
              <button onClick={() => charge("gopay")} disabled={!!busy} className="btn-ghost w-full">
                {busy === "gopay" ? "Membuka GoPay…" : "Bayar langsung di aplikasi GoPay"}
              </button>
            )}
            <button onClick={() => charge("snap")} disabled={!!busy} className="btn-ghost w-full">
              {busy === "snap" ? "Membuka…" : "Metode lain (Transfer bank / VA, kartu)"}
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-muted">Pembayaran diproses aman oleh Midtrans.</p>
    </main>
  );
}
