/** Cek env wajib. Nilai tidak pernah ditampilkan, hanya ada / tidak ada. */
export const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "PRINT_SECRET",
  "MIDTRANS_SERVER_KEY",
  "APP_URL",
] as const;

export const missingEnv = () => REQUIRED_ENV.filter((k) => !process.env[k]);
export const hasSupabaseEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
