import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rupiah } from "@/lib/plans";

export const metadata: Metadata = { title: "Admin — CVku", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Email yang boleh membuka /admin. Bisa ditimpa lewat env ADMIN_EMAILS (pisah koma). */
const ADMINS = (process.env.ADMIN_EMAILS || "dbts92@gmail.com").split(",").map((e) => e.trim().toLowerCase());

type Pay = { order_id: string; user_id: string; plan: string; amount: number; status: string; paid_at: string | null; created_at: string };

export default async function Admin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  if (!ADMINS.includes((user.email ?? "").toLowerCase())) notFound();

  const db = createAdminClient();
  const since30 = new Date(Date.now() - 30 * 864e5).toISOString();
  const [{ data: pays }, { count: users }, { count: cvs }, { count: cards }, { data: pros }] = await Promise.all([
    db.from("payments").select("order_id,user_id,plan,amount,status,paid_at,created_at").order("created_at", { ascending: false }).limit(200),
    db.from("profiles").select("id", { count: "exact", head: true }),
    db.from("cvs").select("id", { count: "exact", head: true }),
    db.from("cards").select("id", { count: "exact", head: true }),
    db.from("profiles").select("id").gt("pro_until", new Date().toISOString()),
  ]);
  const list = (pays ?? []) as Pay[];
  const paid = list.filter((p) => p.status === "paid");
  const total = paid.reduce((s, p) => s + p.amount, 0);
  const last30 = paid.filter((p) => (p.paid_at ?? p.created_at) >= since30);
  const today = new Date().toISOString().slice(0, 10);
  const todayPaid = paid.filter((p) => (p.paid_at ?? "").startsWith(today));

  const ids = [...new Set(list.map((p) => p.user_id))];
  const { data: emails } = ids.length ? await db.from("profiles").select("id,email").in("id", ids) : { data: [] };
  const emailOf = new Map((emails ?? []).map((e: { id: string; email: string | null }) => [e.id, e.email ?? "—"]));
  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

  const stats = [
    ["Pendapatan total", rupiah(total), `${paid.length} transaksi lunas`],
    ["30 hari terakhir", rupiah(last30.reduce((s, p) => s + p.amount, 0)), `${last30.length} transaksi`],
    ["Hari ini", rupiah(todayPaid.reduce((s, p) => s + p.amount, 0)), `${todayPaid.length} transaksi`],
    ["Pengguna Pro aktif", String(pros?.length ?? 0), `dari ${users ?? 0} pengguna`],
    ["CV dibuat", String(cvs ?? 0), "tersimpan di akun"],
    ["Kartu dibuat", String(cards ?? 0), "tersimpan di akun"],
  ];
  const badge: Record<string, string> = {
    paid: "bg-brand/10 text-brand", pending: "bg-gold/25 text-ink", failed: "bg-red-50 text-red-700", expired: "bg-line text-muted",
  };

  return (
    <>
      <Navbar />
      <main className="pb-safe mx-auto max-w-6xl px-3 py-8 sm:px-4">
        <h1 className="font-display text-3xl font-bold">Penjualan</h1>
        <p className="text-sm text-muted">Data langsung dari database. Saldo & pencairan dana ada di dashboard Midtrans.</p>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {stats.map(([label, value, sub]) => (
            <div key={label} className="rounded-xl border border-line bg-white p-4">
              <p className="text-xs text-muted">{label}</p>
              <p className="mt-1 text-xl font-bold sm:text-2xl">{value}</p>
              <p className="text-xs text-muted">{sub}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wider text-muted">Transaksi terbaru</h2>
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-paper text-left text-xs text-muted">
              <tr>
                <th className="px-3 py-2">Waktu</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Order</th>
                <th className="px-3 py-2 text-right">Nominal</th><th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-muted">Belum ada transaksi.</td></tr>
              )}
              {list.map((p) => (
                <tr key={p.order_id}>
                  <td className="whitespace-nowrap px-3 py-2">{fmt(p.paid_at ?? p.created_at)}</td>
                  <td className="px-3 py-2">{emailOf.get(p.user_id)}</td>
                  <td className="px-3 py-2 font-mono text-xs">{p.order_id}</td>
                  <td className="px-3 py-2 text-right">{rupiah(p.amount)}</td>
                  <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge[p.status] ?? ""}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
