import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Kebijakan Privasi — CVku" };

export default function Privasi() {
  return (
    <LegalPage title="Kebijakan Privasi">
      <p>Kebijakan ini menjelaskan data apa yang dikumpulkan {SITE.name} dan bagaimana kami menggunakannya, sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.</p>
      <h2>Data yang kami kumpulkan</h2>
      <ul>
        <li><strong>Akun:</strong> email dan nama (jika login dengan Google).</li>
        <li><strong>Isi CV & kartu:</strong> data yang kamu ketik sendiri (nama, kontak, riwayat kerja, pendidikan, pesan ucapan).</li>
        <li><strong>Pembayaran:</strong> nomor pesanan, paket, nominal, dan status. Data kartu/rekening diproses langsung oleh Midtrans dan tidak kami simpan.</li>
        <li><strong>Draft tanpa login:</strong> disimpan hanya di browser kamu (localStorage) sampai kamu masuk.</li>
      </ul>
      <h2>Penggunaan data</h2>
      <p>Data hanya dipakai untuk menjalankan layanan: menyimpan dan menampilkan CV/kartu milikmu, membuat file unduhan, memproses pembayaran, dan menghubungimu terkait akun. Kami <strong>tidak menjual</strong> data pribadimu.</p>
      <h2>Penyimpanan & keamanan</h2>
      <p>Data disimpan di Supabase dengan pembatasan akses per pengguna (hanya kamu yang bisa membaca CV dan kartu milikmu). Koneksi dienkripsi (HTTPS).</p>
      <h2>Pihak ketiga</h2>
      <ul>
        <li>Supabase — database & autentikasi</li>
        <li>Midtrans — pemrosesan pembayaran</li>
        <li>Vercel — hosting</li>
        <li>Google — login (opsional) & font</li>
      </ul>
      <h2>Hak kamu</h2>
      <p>Kamu bisa menghapus CV/kartu kapan saja dari dashboard. Untuk menghapus akun beserta seluruh data, kirim permintaan ke <a href={`mailto:${SITE.email}`}>{SITE.email}</a>; kami proses maksimal 7 hari kerja.</p>
    </LegalPage>
  );
}
