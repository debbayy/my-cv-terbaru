export type CardData = {
  to: string; // "Untuk ..."
  headline: string; // judul besar
  message: string; // isi ucapan
  from: string; // "Dari ..."
};

export const CARD_W = 540; // px (CSS) — PNG diexport 2x = 1080 x 1350 (rasio 4:5, pas untuk WA/IG)
export const CARD_H = 675;

export type Occasion =
  | "ulang-tahun" | "lebaran" | "ramadan" | "idul-adha" | "pernikahan" | "anniversary" | "kelahiran"
  | "wisuda" | "selamat" | "terima-kasih" | "hari-ibu" | "lekas-sembuh" | "duka-cita" | "natal" | "imlek" | "tahun-baru" | "hari-guru" | "kemerdekaan";

export const OCCASIONS: Record<Occasion, string> = {
  "ulang-tahun": "Ulang Tahun",
  lebaran: "Lebaran",
  ramadan: "Ramadan",
  "idul-adha": "Idul Adha",
  pernikahan: "Pernikahan",
  anniversary: "Anniversary",
  kelahiran: "Kelahiran Bayi",
  wisuda: "Wisuda",
  selamat: "Selamat / Promosi",
  "terima-kasih": "Terima Kasih",
  "hari-ibu": "Hari Ibu",
  "lekas-sembuh": "Lekas Sembuh",
  "duka-cita": "Duka Cita",
  natal: "Natal",
  imlek: "Imlek",
  "tahun-baru": "Tahun Baru",
  "hari-guru": "Hari Guru",
  kemerdekaan: "17 Agustus",
};

export const normalizeCard = (raw: unknown, fallback: CardData): CardData => {
  const d = (raw ?? {}) as Partial<CardData>;
  return { ...fallback, ...d };
};
