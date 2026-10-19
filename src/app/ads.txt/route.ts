import { ADSENSE_CLIENT } from "@/lib/ads";

/** /ads.txt — diwajibkan Google AdSense. Otomatis dari NEXT_PUBLIC_ADSENSE_CLIENT. */
export function GET() {
  const pub = ADSENSE_CLIENT.replace(/^ca-/, "");
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "# AdSense belum dikonfigurasi\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
