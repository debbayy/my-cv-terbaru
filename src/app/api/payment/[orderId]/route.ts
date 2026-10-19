import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTransactionStatus, isPaidStatus } from "@/lib/midtrans";
import { PLANS, type PlanId } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dipolling halaman /bayar tiap ~2 detik.
 * Kalau Midtrans bilang sudah lunas → Pro langsung diaktifkan saat itu juga
 * (webhook tetap jalan sebagai cadangan; activate_pro idempotent jadi tidak dobel).
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: pay } = await supabase.from("payments").select("status,plan,amount").eq("order_id", orderId).single();
  if (!pay) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (pay.status === "paid") return NextResponse.json({ status: "paid" });

  const s = await getTransactionStatus(orderId);
  const amountOk = !s.gross_amount || Math.round(Number(s.gross_amount)) === pay.amount;

  if (isPaidStatus(s.transaction_status, s.fraud_status) && amountOk) {
    const plan = PLANS[pay.plan as PlanId];
    const { error } = await createAdminClient().rpc("activate_pro", {
      p_order_id: orderId, p_days: plan?.days ?? 30, p_raw: s,
    });
    if (error) {
      console.error("[payment status] activate_pro", error);
      return NextResponse.json({ status: "pending" });
    }
    return NextResponse.json({ status: "paid" });
  }
  if (["expire", "cancel", "deny", "failure"].includes(s.transaction_status ?? "")) {
    return NextResponse.json({ status: s.transaction_status === "expire" ? "expired" : "failed" });
  }
  return NextResponse.json({ status: "pending" });
}
