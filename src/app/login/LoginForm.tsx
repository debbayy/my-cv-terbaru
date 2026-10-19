"use client";
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Ubah ke true kalau login Google sudah siap (Supabase → Providers → Google). */
const SHOW_GOOGLE = false;

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("next");
  const next = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const urlError = params.get("error");
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(
    urlError ? { type: "error", text: urlError } : null,
  );

  // Terjemahkan error Supabase supaya penyebabnya kelihatan
  const explain = (m: string) => {
    const t = m.toLowerCase();
    if (t.includes("email not confirmed")) return "Email belum dikonfirmasi. Cek inbox/spam, klik link konfirmasi, lalu masuk lagi.";
    if (t.includes("invalid login credentials")) return "Email atau password salah (atau akun belum terdaftar — klik Daftar).";
    if (t.includes("already registered")) return "Email sudah terdaftar. Silakan masuk.";
    if (t.includes("provider is not enabled")) return "Login Google belum diaktifkan di Supabase. Pakai email dulu.";
    if (t.includes("database error")) return "Gagal membuat akun di database. Pastikan schema.sql sudah dijalankan di Supabase.";
    if (t.includes("rate limit")) return "Terlalu banyak percobaan / email. Tunggu beberapa menit lalu coba lagi.";
    return m;
  };

  const callback = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  // Link verifikasi email kembali ke halaman login ini (bukan localhost), membawa tujuan berikutnya
  const verifyRedirect = () => {
    const q = new URLSearchParams({ verified: "1", next });
    if (params.get("reason")) q.set("reason", params.get("reason")!);
    return `${window.location.origin}/login?${q}`;
  };

  // Dibuka dari link verifikasi email
  useEffect(() => {
    if (params.get("verified") !== "1") return;
    const code = params.get("code");
    (async () => {
      if (code) {
        // Browser yang sama → langsung masuk tanpa ketik password lagi
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace(next);
          router.refresh();
          return;
        }
      }
      setMsg({ type: "info", text: "✅ Email kamu sudah terverifikasi. Silakan masuk." });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg({ type: "error", text: explain(error.message) });
      else {
        router.replace(next);
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: verifyRedirect() },
      });
      if (error) setMsg({ type: "error", text: explain(error.message) });
      else if (data.session) {
        router.replace(next);
        router.refresh();
      } else {
        setMode("login");
        setMsg({ type: "info", text: `Link verifikasi sudah dikirim ke ${email}. Buka email (cek juga folder Spam), klik link-nya, lalu kamu otomatis kembali ke sini.` });
      }
    }
    setLoading(false);
  }

  // Cek apakah provider Google sudah aktif di Supabase, supaya tidak mendarat di halaman error JSON
  const [googleOn, setGoogleOn] = useState<boolean | null>(null);
  useEffect(() => {
    fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_ANON_KEY } })
      .then((r) => r.json())
      .then((s) => setGoogleOn(!!s?.external?.google))
      .catch(() => setGoogleOn(true));
  }, []);

  async function google() {
    if (googleOn === false) {
      setMsg({ type: "error", text: explain("provider is not enabled") });
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback() } });
    if (error) setMsg({ type: "error", text: explain(error.message) });
  }

  return (
    <>
      <h1 className="text-xl font-bold">{mode === "login" ? "Masuk" : "Buat akun gratis"}</h1>
      <p className="mb-5 text-sm text-muted">
        {params.get("reason") === "download"
          ? "Satu langkah lagi! Masuk untuk download CV kamu — isian CV kamu tetap aman."
          : "Simpan CV kamu dan edit kapan saja."}
      </p>

      {SHOW_GOOGLE && (
        <>
      <button onClick={google} className="btn-ghost mb-4 w-full">
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
        </svg>
        Lanjut dengan Google
      </button>

      <div className="my-4 flex items-center gap-3 text-xs text-muted">
        <div className="h-px flex-1 bg-line" /> atau <div className="h-px flex-1 bg-line" />
      </div>

        </>
      )}

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={6} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {msg && (
          <p className={`rounded-lg px-3 py-2 text-sm ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-brand/10 text-brand"}`}>
            {msg.text}
          </p>
        )}
        <button disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <button className="font-semibold text-brand" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(null); }}>
          {mode === "login" ? "Daftar" : "Masuk"}
        </button>
      </p>
    </>
  );
}
