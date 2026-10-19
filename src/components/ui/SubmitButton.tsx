"use client";
import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

/**
 * Tombol untuk <form action={serverAction}>. Saat proses berjalan: spinner + dinonaktifkan,
 * jadi tidak bisa diklik berulang. `confirm` menampilkan konfirmasi sebelum jalan.
 */
export default function SubmitButton({
  children, pendingText, className = "", confirm, title,
}: { children: React.ReactNode; pendingText?: string; className?: string; confirm?: string; title?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      title={title}
      aria-busy={pending}
      onClick={(e) => { if (confirm && !pending && !window.confirm(confirm)) e.preventDefault(); }}
      className={`inline-flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending && <Spinner className="h-3.5 w-3.5" />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
