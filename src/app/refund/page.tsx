import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Kebijakan Refund — CVku" };

export default function Refund() {
  return (
    <LegalPage title="Kebijakan Refund">
      <p>Karena {SITE.name} adalah produk digital yang bisa dicoba gratis (edit & preview) sebelum membeli, pembayaran pada umumnya tidak dapat dikembalikan. Namun kami akan mengembalikan dana penuh jika:</p>
      <ul>
        <li>Kamu sudah membayar tetapi akses Pro <strong>tidak aktif</strong> dan tim kami tidak dapat memperbaikinya dalam 2×24 jam.</li>
        <li>Terjadi <strong>pembayaran ganda</strong> untuk pesanan yang sama.</li>
        <li>File unduhan <strong>rusak/gagal dibuat</strong> karena kesalahan sistem kami dan tidak dapat diperbaiki.</li>
      </ul>
      <h2>Cara mengajukan</h2>
      <ol>
        <li>Kirim email ke <a href={`mailto:${SITE.email}`}>{SITE.email}</a> maksimal 7 hari setelah pembayaran.</li>
        <li>Sertakan email akun, nomor pesanan (diawali <code>CVKU-</code>), dan bukti pembayaran.</li>
        <li>Kami membalas maksimal 2 hari kerja. Refund yang disetujui dikirim ke metode pembayaran asal atau rekening yang kamu tentukan dalam 7–14 hari kerja.</li>
      </ol>
    </LegalPage>
  );
}
