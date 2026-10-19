import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyMidtransSignature } from "@/lib/midtrans";
import { PLANS, type PlanId } from "@/lib/plans";

export const runtime = "nodejs";

type Notification = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
};

/**
 * Set URL ini di Midtrans Dashboard → Settings → Payment → Notification URL:
 *   https://domainkamu.com/api/webhooks/midtrans
 */
export async function POST(req: NextRequest) {
  const n = (await req.json().catch(() => null)) as Notification | null;
  if (!n?.order_id || !n.signature_key) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  if (!verifyMidtransSignature(n)) return NextResponse.json({ error: "invalid_signature" }, { status: 403 });

  const db = createAdminClient();
  const { data: payment } = await db.from("payments").select("plan,amount,status").eq("order_id", n.order_id).single();
  if (!payment) return NextResponse.json({ ok: true }); // order bukan dari kita, abaikan

  // Pastikan nominal yang dibayar sama dengan harga paket
  if (Math.round(Number(n.gross_amount)) !== payment.amount) {
    console.error("[midtrans] amount mismatch", n.order_id, n.gross_amount, payment.amount);
    return NextResponse.json({ error: "amount_mismatch" }, { status: 400 });
  }

  const s = n.transaction_status;
  const paid = s === "settlement" || (s === "capture" && (n.fraud_status ?? "accept") === "accept");

  if (paid) {
    const plan = PLANS[payment.plan as PlanId];
    const { error } = await db.rpc("activate_pro", { p_order_id: n.order_id, p_days: plan?.days ?? 30, p_raw: n });
    if (error) {
      console.error("[midtrans] activate_pro", error);
      return NextResponse.json({ error: "db_error" }, { status: 500 }); // Midtrans akan retry
    }
  } else if (["deny", "cancel", "expire", "failure"].includes(s) && payment.status !== "paid") {
    await db.from("payments").update({ status: s === "expire" ? "expired" : "failed", raw: n }).eq("order_id", n.order_id);
  }

  return NextResponse.json({ ok: true });
}
