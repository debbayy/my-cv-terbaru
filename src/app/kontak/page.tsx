import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Kontak — CVku" };

export default function Kontak() {
  return (
    <LegalPage title="Kontak">
      <p>Ada pertanyaan, kendala pembayaran, atau saran? Hubungi kami:</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={`mailto:${SITE.email}`} className="rounded-xl border border-line bg-white p-5 no-underline hover:border-brand">
          <p className="text-sm text-muted">Email</p>
          <p className="font-semibold text-ink">{SITE.email}</p>
        </a>
        {SITE.whatsapp && (
          <a href={`https://wa.me/${SITE.whatsapp}`} className="rounded-xl border border-line bg-white p-5 no-underline hover:border-brand">
            <p className="text-sm text-muted">WhatsApp</p>
            <p className="font-semibold text-ink">+{SITE.whatsapp}</p>
          </a>
        )}
      </div>
      <p className="text-sm text-muted">Jam layanan: Senin–Jumat, 09.00–17.00 WIB. Berlokasi di {SITE.city}.</p>
      <p className="text-sm text-muted">Untuk kendala pembayaran, sertakan nomor pesanan (diawali <code>CVKU-</code>).</p>
    </LegalPage>
  );
}
