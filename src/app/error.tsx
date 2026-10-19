"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-bold">Ada yang error 😵</h1>
        <p className="mt-2 text-muted">
          Coba muat ulang. Kalau kamu pemilik situs, buka <code className="rounded bg-white px-1">/api/health</code> untuk cek konfigurasi.
        </p>
        {error.digest && <p className="mt-2 text-xs text-muted">Kode: {error.digest}</p>}
        <button onClick={reset} className="btn-primary mt-6">Coba lagi</button>
      </div>
    </main>
  );
}
