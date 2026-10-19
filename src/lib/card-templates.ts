import type { ComponentType } from "react";
import type { CardData, Occasion } from "@/lib/card";
import * as C from "@/components/cards/cards";

export type CardTemplate = {
  id: string;
  name: string;
  occasion: Occasion;
  Component: ComponentType<{ data: CardData }>;
  defaults: CardData;
};

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "ultah-confetti", name: "Confetti Pop", occasion: "ulang-tahun", Component: C.BirthdayConfetti,
    defaults: { to: "Untuk Nadia", headline: "Selamat Ulang Tahun!", message: "Semoga tahun ini penuh tawa, rezeki lancar,\ndan semua mimpimu satu per satu jadi nyata.", from: "Peluk hangat, Rina" },
  },
  {
    id: "ultah-kue", name: "Kue Manis", occasion: "ulang-tahun", Component: C.BirthdayCake,
    defaults: { to: "Dear Bunda tersayang", headline: "Happy Birthday", message: "Terima kasih sudah jadi rumah ternyaman.\nSehat selalu dan panjang umur ya.", from: "Love, anak-anakmu" },
  },
  {
    id: "lebaran-ketupat", name: "Ketupat Emas", occasion: "lebaran", Component: C.LebaranKetupat,
    defaults: { to: "Untuk keluarga besar", headline: "Selamat Hari Raya Idul Fitri", message: "Semoga amal ibadah kita diterima\ndan kita kembali fitri.", from: "Keluarga Pratama" },
  },
  {
    id: "nikah-floral", name: "Floral Ivory", occasion: "pernikahan", Component: C.WeddingFloral,
    defaults: { to: "Untuk Dimas & Ayu", headline: "Selamat Menempuh Hidup Baru", message: "Semoga menjadi keluarga yang sakinah,\nmawaddah, warahmah — bahagia selamanya.", from: "Dengan doa terbaik, Rina" },
  },
  {
    id: "wisuda-toga", name: "Toga Emas", occasion: "wisuda", Component: C.GraduationGold,
    defaults: { to: "Untuk Fajar, S.Kom.", headline: "Selamat Wisuda!", message: "Kerja kerasmu terbayar.\nIni baru awal dari perjalanan hebatmu.", from: "Bangga padamu, Kakak" },
  },
  {
    id: "thanks-hearts", name: "Cute Hearts", occasion: "terima-kasih", Component: C.ThanksHearts,
    defaults: { to: "Untuk Bu Sari", headline: "Terima Kasih!", message: "Atas bimbingan dan kesabarannya selama ini.\nIlmunya akan selalu saya ingat.", from: "Murid kesayanganmu, Rina" },
  },
  {
    id: "natal-pohon", name: "Pohon Natal", occasion: "natal", Component: C.ChristmasTree,
    defaults: { to: "Untuk sahabatku", headline: "Selamat Natal", message: "Damai Natal menyertaimu dan keluarga.\nSemoga penuh berkat di hari-hari mendatang.", from: "Salam hangat, Rina" },
  },
  {
    id: "newyear-fireworks", name: "Kembang Api", occasion: "tahun-baru", Component: C.NewYearFireworks,
    defaults: { to: "Untuk tim hebat", headline: "Selamat Tahun Baru 2027", message: "Terima kasih untuk tahun yang luar biasa.\nSiap bikin cerita baru bareng lagi!", from: "Rina" },
  },
];

export const getCardTemplate = (id: string) => CARD_TEMPLATES.find((t) => t.id === id) ?? CARD_TEMPLATES[0];
