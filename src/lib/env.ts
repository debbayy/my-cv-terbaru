/** Env RAHASIA yang wajib di-set di Vercel. Sisanya punya default di src/lib/config.ts. */
export const REQUIRED_ENV = ["SUPABASE_SERVICE_ROLE_KEY", "MIDTRANS_SERVER_KEY"] as const;
export const missingEnv = () => REQUIRED_ENV.filter((k) => !process.env[k]);
