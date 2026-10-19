export type CardData = {
  to: string; // "Untuk ..."
  headline: string; // judul besar
  message: string; // isi ucapan
  from: string; // "Dari ..."
};

export const CARD_W = 540; // px (CSS) — PNG diexport 2x = 1080 x 1350 (rasio 4:5, pas untuk WA/IG)
export const CARD_H = 675;

export type Occasion =
  | "ulang-tahun" | "lebaran" | "pernikahan" | "wisuda" | "terima-kasih" | "natal" | "tahun-baru";

export const OCCASIONS: Record<Occasion, string> = {
  "ulang-tahun": "Ulang Tahun",
  lebaran: "Lebaran",
  pernikahan: "Pernikahan",
  wisuda: "Wisuda",
  "terima-kasih": "Terima Kasih",
  natal: "Natal",
  "tahun-baru": "Tahun Baru",
};

export const normalizeCard = (raw: unknown, fallback: CardData): CardData => {
  const d = (raw ?? {}) as Partial<CardData>;
  return { ...fallback, ...d };
};
