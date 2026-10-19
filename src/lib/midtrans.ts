import "server-only";
import { createHash } from "node:crypto";

const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
const SNAP_URL = isProd ? "https://app.midtrans.com/snap/v1/transactions" : "https://app.sandbox.midtrans.com/snap/v1/transactions";

const serverKey = () => {
  const k = process.env.MIDTRANS_SERVER_KEY;
  if (!k) throw new Error("MIDTRANS_SERVER_KEY belum di-set");
  return k;
};

export async function createSnapTransaction(input: {
  orderId: string;
  amount: number;
  itemName: string;
  email?: string;
  finishUrl: string;
}) {
  const res = await fetch(SNAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic " + Buffer.from(serverKey() + ":").toString("base64"),
    },
    body: JSON.stringify({
      transaction_details: { order_id: input.orderId, gross_amount: input.amount },
      item_details: [{ id: input.itemName, name: input.itemName, price: input.amount, quantity: 1 }],
      customer_details: input.email ? { email: input.email } : undefined,
      callbacks: { finish: input.finishUrl },
      expiry: { unit: "hours", duration: 24 },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Midtrans ${res.status}: ${JSON.stringify(json)}`);
  return json as { token: string; redirect_url: string };
}

/** signature_key = SHA512(order_id + status_code + gross_amount + ServerKey) */
export function verifyMidtransSignature(n: { order_id: string; status_code: string; gross_amount: string; signature_key: string }) {
  const expected = createHash("sha512").update(n.order_id + n.status_code + n.gross_amount + serverKey()).digest("hex");
  return expected === n.signature_key;
}

/* ===================== Core API (QRIS / GoPay langsung di web kita) ===================== */
const CORE = isProd ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
const auth = () => "Basic " + Buffer.from(serverKey() + ":").toString("base64");

type Action = { name: string; method: string; url: string };
export type ChargeResult = {
  status_code: string;
  transaction_status: string;
  qr_string?: string;
  actions?: Action[];
  expiry_time?: string;
};

/**
 * Buat tagihan QRIS (bisa dibayar pakai semua e-wallet & m-banking) atau GoPay (deeplink di HP).
 * QRIS di Midtrans memakai acquirer "gopay".
 */
export async function chargeCore(input: {
  method: "qris" | "gopay";
  orderId: string;
  amount: number;
  itemName: string;
  email?: string;
  callbackUrl: string;
}) {
  const body: Record<string, unknown> = {
    payment_type: input.method,
    transaction_details: { order_id: input.orderId, gross_amount: input.amount },
    item_details: [{ id: input.itemName, name: input.itemName, price: input.amount, quantity: 1 }],
    customer_details: input.email ? { email: input.email } : undefined,
    custom_expiry: { expiry_duration: 15, unit: "minute" },
  };
  if (input.method === "qris") body.qris = { acquirer: "gopay" };
  if (input.method === "gopay") body.gopay = { enable_callback: true, callback_url: input.callbackUrl };

  const res = await fetch(`${CORE}/v2/charge`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: auth() },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as ChargeResult & { status_message?: string };
  if (!res.ok || !["200", "201"].includes(json.status_code)) {
    throw new Error(`Midtrans charge ${json.status_code}: ${json.status_message ?? JSON.stringify(json)}`);
  }
  const action = (n: string) => json.actions?.find((a) => a.name === n)?.url;
  return {
    qrString: json.qr_string,
    qrUrl: action("generate-qr-code") ?? action("generate-qr-code-v2"),
    deeplink: action("deeplink-redirect"),
    expiresAt: json.expiry_time,
  };
}

/** Cek status langsung ke Midtrans — dipakai polling supaya Pro aktif detik itu juga (tidak menunggu webhook). */
export async function getTransactionStatus(orderId: string) {
  const res = await fetch(`${CORE}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: { Accept: "application/json", Authorization: auth() },
    cache: "no-store",
  });
  return (await res.json()) as {
    status_code: string;
    transaction_status?: string;
    fraud_status?: string;
    gross_amount?: string;
  };
}

export const isPaidStatus = (s?: string, fraud?: string) =>
  s === "settlement" || (s === "capture" && (fraud ?? "accept") === "accept");
