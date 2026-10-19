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
