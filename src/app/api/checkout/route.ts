import { NextResponse, type NextRequest } from "next/server";
import { appUrl } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { chargeCore, createSnapTransaction } from "@/lib/midtrans";
import { PLANS, type PlanId } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * POST { plan, method: "qris" | "gopay" | "snap", next }
 * - qris  → QR langsung ditampilkan di halaman /bayar (paling cepat)
 * - gopay → deeplink buka aplikasi GoPay di HP
 * - snap  → halaman Midtrans (VA bank, kartu, dll)
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { plan?: string; method?: string; next?: string };
  const plan = PLANS[(body.plan ?? "pro_monthly") as PlanId];
  if (!plan) return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  const method = body.method === "gopay" || body.method === "snap" ? body.method : "qris";
  const next = body.next && body.next.startsWith("/") && !body.next.startsWith("//") ? body.next : "/dashboard";

  const orderId = `CVKU-${user.id.slice(0, 8)}-${Date.now()}`;
  const base = appUrl(req.nextUrl.origin);
  const returnUrl = `${base}/bayar?order=${encodeURIComponent(orderId)}&next=${encodeURIComponent(next)}`;

  // Harga dari server (PLANS), BUKAN dari client.
  const { error } = await createAdminClient().from("payments").insert({
    order_id: orderId, user_id: user.id, plan: plan.id, amount: plan.price, status: "pending",
  });
  if (error) {
    console.error("[checkout] db", error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  try {
    if (method === "snap") {
      const snap = await createSnapTransaction({
        orderId, amount: plan.price, itemName: plan.name, email: user.email, finishUrl: returnUrl,
      });
      return NextResponse.json({ orderId, redirectUrl: snap.redirect_url });
    }
    const r = await chargeCore({
      method, orderId, amount: plan.price, itemName: plan.name, email: user.email, callbackUrl: returnUrl,
    });
    return NextResponse.json({ orderId, ...r, amount: plan.price });
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.json({ error: "payment_gateway_error" }, { status: 502 });
  }
}
