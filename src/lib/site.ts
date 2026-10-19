/**
 * Info bisnis yang tampil di halaman Kontak & legal.
 * ⚠️ Ganti nilai di bawah sebelum mengajukan aktivasi Production ke Midtrans
 * (Midtrans biasanya mengecek kontak yang bisa dihubungi di website).
 */
export const SITE = {
  name: "CVku",
  owner: "Pemilik CVku", // nama kamu / nama usaha
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "halo@cvku.id", // email support
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WA || "", // contoh: 6281234567890
  city: "Indonesia", // kota domisili usaha
  url: "https://my-cv-terbaru.vercel.app",
  updated: "19 Oktober 2026",
};
