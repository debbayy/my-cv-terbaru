/**
 * Google AdSense. Isi di Vercel → Environment Variables setelah akun AdSense disetujui:
 *   NEXT_PUBLIC_ADSENSE_CLIENT = ca-pub-xxxxxxxxxxxxxxxx
 *   NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT = (ID unit iklan display, opsional)
 * Selama kosong, slot iklan menampilkan promo "Upgrade ke Pro — tanpa iklan".
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

export const AD_SLOTS: Record<string, string> = {
  default: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT || "",
  landing: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LANDING || "",
  gallery: process.env.NEXT_PUBLIC_ADSENSE_SLOT_GALLERY || "",
  editor: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EDITOR || "",
  dashboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DASHBOARD || "",
};
