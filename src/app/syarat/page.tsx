import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";
import { PLANS, rupiah } from "@/lib/plans";

export const metadata = { title: "Syarat & Ketentuan — CVku" };

export default function Syarat() {
  const p = PLANS.pro_monthly;
  return (
    <LegalPage title="Syarat & Ketentuan">
      <p>Dengan menggunakan {SITE.name} ({SITE.url}), kamu menyetujui syarat dan ketentuan berikut.</p>
      <h2>1. Layanan</h2>
      <p>{SITE.name} menyediakan editor online untuk membuat CV (curriculum vitae) dan kartu ucapan digital. Membuat, mengedit, dan melihat pratinjau dapat dilakukan gratis. Mengunduh file hasil (PDF/PNG) tanpa watermark memerlukan paket Pro.</p>
      <h2>2. Paket Pro & pembayaran</h2>
      <ul>
        <li>Paket {p.name}: {rupiah(p.price)} untuk akses unduh tanpa batas selama {p.days} hari sejak pembayaran berhasil.</li>
        <li>Pembayaran sekali bayar dan <strong>tidak diperpanjang otomatis</strong>. Membeli lagi saat masih aktif akan menambah masa aktif.</li>
        <li>Pembayaran diproses oleh Midtrans (PT Midtrans) melalui QRIS, e-wallet, transfer bank/virtual account, atau kartu. Kami tidak menyimpan data kartu atau rekening kamu.</li>
        <li>Akses Pro aktif otomatis setelah pembayaran terkonfirmasi, biasanya dalam hitungan detik.</li>
      </ul>
      <h2>3. Akun</h2>
      <p>Kamu bertanggung jawab menjaga kerahasiaan akun. Satu akun untuk satu orang; akun Pro tidak boleh dibagikan atau dijual kembali.</p>
      <h2>4. Konten milik pengguna</h2>
      <p>Isi CV dan kartu yang kamu buat adalah milikmu. Kamu bertanggung jawab atas kebenaran informasi yang kamu tulis. Dilarang membuat konten yang melanggar hukum, menipu, atau melanggar hak orang lain.</p>
      <h2>5. Hak kekayaan intelektual</h2>
      <p>Desain template, ilustrasi, dan kode {SITE.name} adalah milik {SITE.name}. File hasil unduhan boleh kamu gunakan untuk keperluan pribadi (melamar kerja, mengirim ucapan), tetapi template-nya tidak boleh dijual ulang sebagai produk template.</p>
      <h2>6. Batasan tanggung jawab</h2>
      <p>Kami berusaha agar template ramah ATS, namun tidak menjamin hasil seleksi kerja. Layanan disediakan &quot;sebagaimana adanya&quot;; kami tidak bertanggung jawab atas kerugian tidak langsung dari penggunaan layanan.</p>
      <h2>7. Perubahan</h2>
      <p>Syarat ini dapat diperbarui sewaktu-waktu. Perubahan berlaku sejak dipublikasikan di halaman ini.</p>
      <h2>8. Kontak</h2>
      <p>Pertanyaan: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </LegalPage>
  );
}
