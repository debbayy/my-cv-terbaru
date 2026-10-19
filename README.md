# CVku — Web Pembuat CV ATS

Next.js 16 (App Router) · Supabase (auth + DB) · Midtrans (QRIS/e-wallet/VA) · Puppeteer (PDF berbasis teks)

**Model bisnis:** semua template CV (8) dan kartu ucapan (8) bisa diisi & di-preview **tanpa login**. Saat klik Download → login → (kalau belum Pro) bayar **Pro — Rp50.000 / 30 hari**. Isian tamu disimpan di browser lalu dipindah ke akun otomatis setelah login.

### Alur pengguna
```
Pilih template → isi → preview (watermark)      ← tanpa login
      ↓ klik Download
Login / daftar → draft dipindah ke akun (/claim) → paywall Pro → bayar Midtrans → download
```

---

## Setup (± 15 menit)

### 1. Install
```bash
npm install          # juga mendownload Chrome untuk puppeteer (dipakai saat dev lokal)
cp .env.example .env.local
```

### 2. Supabase
1. Buat project di supabase.com
2. **SQL Editor** → paste isi `supabase/schema.sql` → Run
3. **Project Settings → API** → isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` di `.env.local`
4. **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000` (nanti ganti domain production)
   - Redirect URLs: tambahkan `http://localhost:3000/auth/callback` dan `https://domainkamu.com/auth/callback`
5. (Opsional) **Authentication → Providers → Google** untuk login Google
6. (Opsional, dev) matikan "Confirm email" supaya daftar langsung masuk

### 3. Midtrans
1. Daftar di midtrans.com → pakai **Sandbox** dulu
2. **Settings → Access Keys** → salin Server Key ke `MIDTRANS_SERVER_KEY`
3. **Settings → Payment → Notification URL**: `https://domainkamu.com/api/webhooks/midtrans`
   - Untuk tes lokal pakai tunnel: `npx cloudflared tunnel --url http://localhost:3000` lalu pakai URL-nya
4. Tes bayar pakai simulator: https://simulator.sandbox.midtrans.com

### 4. Secret & jalankan
```bash
# isi PRINT_SECRET dengan:
openssl rand -hex 32

npm run dev
```

---

## Cara kerja paywall (penting)

```
Editor (browser)                     Server
────────────────                     ──────
Preview + watermark   ──Download──▶  /api/cv/[id]/pdf
Ctrl+P diblokir CSS                    1. cek login
                                       2. cek CV milik user (RLS)
                                       3. cek profiles.pro_until > now   ← paywall
                                       4. buat token HMAC 60 detik
                                       5. Chromium buka /print/[id]?token=…
                                       6. page.pdf() → PDF teks asli
```

- `pro_until` **tidak bisa diubah user** (tidak ada RLS policy UPDATE). Hanya webhook (service role) lewat fungsi `activate_pro()` yang idempotent.
- Harga diambil dari `src/lib/plans.ts` di server, bukan dari client. Webhook juga mencocokkan nominal + verifikasi `signature_key`.
- `/print/[id]` menolak semua request tanpa token valid.

## Struktur

```
src/
  app/
    page.tsx                 landing + galeri template
    login/                   email/password + Google
    dashboard/               daftar CV, status Pro
    editor/[id]/             editor (form kiri, preview kanan, tab di mobile)
    pricing/                 paket + tombol checkout
    new/route.ts             /new?template=… → bikin CV lalu buka editor
    print/[id]/              halaman yang dirender Chromium jadi PDF
    api/cv/[id]/pdf/         generate PDF (cek Pro)
    api/checkout/            buat transaksi Midtrans Snap
    api/webhooks/midtrans/   aktivasi Pro
    templates.css            CSS template — sama untuk preview & PDF
  components/templates/      AtsClassic, AtsModern, Creative
  lib/
    templates/index.ts       registry template (tambah template baru di sini)
    plans.ts                 harga & durasi paket
    cv.ts                    tipe data CV + contoh
supabase/schema.sql
```

## Update database
Sudah pernah menjalankan `schema.sql` versi lama? Jalankan `supabase/migration-002-cards.sql` di SQL Editor untuk tabel kartu ucapan (atau jalankan ulang `schema.sql` — aman).

## Mode gratis sementara & import CV lama
- `FREE_MODE` (src/lib/access.ts) **aktif secara default**: semua template CV & kartu terbuka, tanpa iklan, tanpa bayar. Untuk menyalakan paywall lagi: set env `NEXT_PUBLIC_FREE_MODE=false` di Vercel lalu Redeploy.
- Upload CV lama (`/import` dan tombol di editor): PDF/DOCX/TXT dibaca di `POST /api/cv/import` (unpdf + mammoth) lalu diparse heuristik oleh `src/lib/cv-import.ts` (judul bagian Indonesia & Inggris). File tidak disimpan. PDF hasil scan tidak didukung (tanpa OCR).

## Paket
| Paket | Harga | Akses download |
|---|---|---|
| Gratis | Rp0 | Isi & preview semua template (watermark) + **1x download CV ATS**; ada iklan |
| Pro (tanpa iklan) | Rp50.000 / 30 hari | 2 template pertama di tiap kategori (CV ATS, CV desain bebas, tiap acara kartu) |
| Pro Max (tanpa iklan) | Rp99.000 / 30 hari | Semua template |

Harga di `src/lib/plans.ts`. Pembagian Pro/Pro Max otomatis: urutan template di registry — 2 teratas tiap kategori = Pro (`PRO_PER_CATEGORY`). Wajib jalankan `supabase/migration-003-promax.sql` dan `supabase/migration-004-free-download.sql`. Akun owner: `migration-005-owner.sql` (Pro Max permanen untuk dbts92@gmail.com; `/admin` juga hanya untuk email ini).

### Iklan (Google AdSense)
Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…` (dan opsional `NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT`) di Vercel. `/ads.txt` otomatis. Selama kosong, slot iklan menampilkan promo upgrade. Iklan tidak pernah tampil untuk Pro/Pro Max.

## Kartu ucapan
Desain ada di `src/components/cards/cards.tsx`, gaya di `src/app/cards.css`, daftar & teks contoh di `src/lib/card-templates.ts`. Ukuran kanvas 540×675 px → export PNG 1080×1350 (pas WA/IG) atau PDF. Di HP, tombol Download PNG langsung membuka menu Share.

## Menambah template
1. Buat komponen di `src/components/templates/NamaBaru.tsx` (terima `{ data: CvData }`)
2. Tambah style dengan prefix `.tpl-namabaru` di `src/app/templates.css`
3. Daftarkan di `src/lib/templates/index.ts` (`ats: true/false`, `pdfMargin`)

Tips ATS: 1 kolom, judul bagian standar (Pengalaman, Pendidikan, Keahlian), tanpa tabel/ikon untuk info penting, jangan taruh teks di gambar.

## Menambah paket (mis. sekali bayar 7 hari)
Tambah entri di `PLANS` (`src/lib/plans.ts`) lalu tambahkan kartu/tombol di `src/app/pricing/page.tsx` dengan `plan="pro_weekly"`. Webhook otomatis memakai `days` dari paket.

## Deploy ke Vercel
- Set semua env di Vercel, dan `APP_URL=https://domainkamu.com`
- Di Vercel, PDF otomatis memakai `@sparticuz/chromium` (lihat `src/lib/browser.ts`). Jika function kena limit ukuran, set **Function Memory 1024 MB+**.
- Ganti `MIDTRANS_IS_PRODUCTION=true` + Server Key production setelah akun Midtrans disetujui.

## Next step yang disarankan
- Mode tamu: boleh isi CV tanpa login (simpan di localStorage), login saat mau download
- Email pengingat 3 hari sebelum Pro habis
- Import data dari LinkedIn / CV lama (PDF)
- Cek skor ATS: cocokkan keyword CV dengan deskripsi lowongan
