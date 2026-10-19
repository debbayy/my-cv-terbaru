"use client";
import { useRef, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import type { ImportResult } from "@/lib/cv-import";

export const ACCEPT = ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

/** Upload CV lama → server membaca teksnya → onDone(hasil). File tidak disimpan. */
export default function ImportCv({
  onDone, label = "Upload CV lama", variant = "button", className = "",
}: { onDone: (r: ImportResult) => void | Promise<void>; label?: string; variant?: "button" | "dropzone"; className?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  async function handle(file: File | undefined | null) {
    if (!file || busy) return;
    setErr(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/cv/import", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal membaca file. Coba lagi.");
      await onDone(json as ImportResult);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const file = (
    <input ref={input} type="file" accept={ACCEPT} className="hidden" disabled={busy} onChange={(e) => handle(e.target.files?.[0])} />
  );

  if (variant === "dropzone") {
    return (
      <div className={className}>
        <div
          role="button"
          tabIndex={0}
          aria-busy={busy}
          onClick={() => !busy && input.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !busy && input.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
          className={`grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed px-4 py-12 text-center transition ${drag ? "border-brand bg-brand/10" : "border-line bg-white hover:border-brand"} ${busy ? "pointer-events-none opacity-80" : ""}`}
        >
          {busy ? (
            <div className="flex flex-col items-center gap-3 text-brand">
              <Spinner className="h-9 w-9" />
              <p className="font-semibold">Membaca CV kamu…</p>
              <p className="text-xs text-muted">Biasanya hanya beberapa detik</p>
            </div>
          ) : (
            <div>
              <p className="text-4xl" aria-hidden>📄</p>
              <p className="mt-3 text-lg font-bold">{label}</p>
              <p className="mt-1 text-sm text-muted">Tarik file ke sini, atau klik untuk memilih</p>
              <p className="mt-3 text-xs text-muted">PDF · DOCX · TXT · maksimal 5 MB</p>
            </div>
          )}
        </div>
        {file}
        {err && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      <button type="button" disabled={busy} aria-busy={busy} onClick={() => input.current?.click()} className="btn-ghost py-1.5">
        {busy && <Spinner className="h-3.5 w-3.5" />}
        {busy ? "Membaca CV…" : `📄 ${label}`}
      </button>
      {file}
      {err && <p className="mt-1 text-[11px] text-red-600">{err}</p>}
    </div>
  );
}

export function summarize(r: ImportResult) {
  const f = r.found;
  const parts = [
    f.experience && `${f.experience} pengalaman`,
    f.education && `${f.education} pendidikan`,
    f.skills && `${f.skills} keahlian`,
    f.certifications && `${f.certifications} sertifikat`,
  ].filter(Boolean);
  return parts.length ? `Terbaca: ${parts.join(", ")}.` : "Data belum banyak terbaca.";
}
