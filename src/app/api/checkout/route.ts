import { appUrl } from "@/lib/config";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSnapTransaction } from "@/lib/midtrans";
import { PLANS, type PlanId } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { plan?: string };
  const plan = PLANS[(body.plan ?? "pro_monthly") as PlanId];
  if (!plan) return NextResponse.json({ error: "invalid_plan" }, { status: 400 });

  const orderId = `CVKU-${user.id.slice(0, 8)}-${Date.now()}`;
  const base = appUrl(req.nextUrl.origin);

  // Harga diambil dari server (PLANS), BUKAN dari client.
  const { error } = await createAdminClient().from("payments").insert({
    order_id: orderId, user_id: user.id, plan: plan.id, amount: plan.price, status: "pending",
  });
  if (error) return NextResponse.json({ error: "db_error" }, { status: 500 });

  try {
    const snap = await createSnapTransaction({
      orderId,
      amount: plan.price,
      itemName: plan.name,
      email: user.email,
      finishUrl: `${base}/dashboard?paid=1`,
    });
    return NextResponse.json({ redirectUrl: snap.redirect_url });
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.json({ error: "payment_gateway_error" }, { status: 502 });
  }
}
