import type { ComponentType } from "react";
import type { CardData, Occasion } from "@/lib/card";
import * as C from "@/components/cards/cards";
import * as D from "@/components/cards/cards2";

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
  {
    id: "ultah-balon", name: "Balon Ceria", occasion: "ulang-tahun", Component: D.BirthdayBalloons,
    defaults: { to: "Untuk si kecil Kenzo", headline: "Selamat Ulang Tahun ke-5!", message: "Tumbuh sehat, pintar, dan selalu ceria ya.\nKami sayang kamu!", from: "Om & Tante" },
  },
  {
    id: "ultah-neon", name: "Neon Party", occasion: "ulang-tahun", Component: D.BirthdayNeon,
    defaults: { to: "Buat bestie, Salsa", headline: "HBD!", message: "Makin glowing, makin sukses,\ndan jangan lupa traktirannya 😆", from: "– Geng Kosan" },
  },
  {
    id: "lebaran-masjid", name: "Masjid Senja", occasion: "lebaran", Component: D.LebaranMosque,
    defaults: { to: "Untuk rekan & sahabat", headline: "Selamat Idul Fitri 1448 H", message: "Taqabbalallahu minna wa minkum.\nMohon maaf lahir dan batin.", from: "Keluarga Besar Rina" },
  },
  {
    id: "ramadan-lentera", name: "Lentera Ramadan", occasion: "ramadan", Component: D.RamadanLantern,
    defaults: { to: "Untuk saudaraku", headline: "Marhaban ya Ramadan", message: "Selamat menunaikan ibadah puasa.\nSemoga penuh berkah dan ampunan.", from: "Rina & keluarga" },
  },
  {
    id: "adha-geo", name: "Geometris Emas", occasion: "idul-adha", Component: D.IdulAdhaGeo,
    defaults: { to: "Untuk keluarga tercinta", headline: "Selamat Hari Raya Idul Adha", message: "Semoga semangat berkurban\nmendekatkan kita pada-Nya.", from: "Keluarga Pratama" },
  },
  {
    id: "nikah-monogram", name: "Monogram Klasik", occasion: "pernikahan", Component: D.WeddingMonogram,
    defaults: { to: "Untuk Rizky & Laras", headline: "Happily Ever After", message: "Selamat atas pernikahan kalian.\nSemoga cinta kalian tumbuh setiap hari.", from: "Dengan cinta, Rina" },
  },
  {
    id: "anniv-hati", name: "Love Red", occasion: "anniversary", Component: D.AnniversaryHearts,
    defaults: { to: "Untuk suamiku tersayang", headline: "Happy Anniversary", message: "Lima tahun bersamamu,\ndan aku masih memilihmu setiap hari.", from: "Selamanya milikmu" },
  },
  {
    id: "bayi-bulan", name: "Bulan & Bintang", occasion: "kelahiran", Component: D.BabyMoon,
    defaults: { to: "Untuk Mama Dinda & Papa Arya", headline: "Selamat atas Kelahiran Buah Hati", message: "Semoga si kecil tumbuh sehat,\nsalih/salihah, dan jadi kebanggaan keluarga.", from: "Peluk dari Tante Rina" },
  },
  {
    id: "selamat-burst", name: "Starburst", occasion: "selamat", Component: D.CongratsBurst,
    defaults: { to: "Untuk Mas Bayu", headline: "Selamat atas Promosinya!", message: "Kerja kerasmu terbayar.\nSukses terus di posisi baru!", from: "Tim Marketing" },
  },
  {
    id: "wisuda-pastel", name: "Pastel Diploma", occasion: "wisuda", Component: D.GraduationPastel,
    defaults: { to: "Untuk Nabila, S.Psi.", headline: "Happy Graduation!", message: "Satu bab selesai, petualangan baru dimulai.\nKami bangga sekali!", from: "Ayah, Ibu & Adik" },
  },
  {
    id: "ibu-floral", name: "Bunga untuk Ibu", occasion: "hari-ibu", Component: D.MothersDayFloral,
    defaults: { to: "Untuk Ibu terhebat", headline: "Selamat Hari Ibu", message: "Terima kasih untuk setiap doa\ndan pelukan yang tak pernah habis.", from: "Anakmu yang selalu sayang" },
  },
  {
    id: "sembuh-matahari", name: "Bunga Matahari", occasion: "lekas-sembuh", Component: D.GetWellSunflower,
    defaults: { to: "Untuk Pak Hendra", headline: "Lekas Sembuh!", message: "Semoga cepat pulih dan kembali\nberaktivitas seperti biasa.", from: "Rekan-rekan kantor" },
  },
  {
    id: "duka-lily", name: "Lily Putih", occasion: "duka-cita", Component: D.CondolenceLily,
    defaults: { to: "Untuk keluarga Bapak Sutrisno", headline: "Turut Berduka Cita", message: "Semoga almarhum diterima di sisi-Nya\ndan keluarga diberi kekuatan serta ketabahan.", from: "Keluarga Rina" },
  },
  {
    id: "natal-ornamen", name: "Ornamen Natal", occasion: "natal", Component: D.ChristmasOrnaments,
    defaults: { to: "Untuk keluarga Simanjuntak", headline: "Merry Christmas", message: "Semoga damai dan sukacita Natal\nmemenuhi rumah kalian.", from: "Salam kasih, Rina" },
  },
  {
    id: "imlek-lampion", name: "Lampion Merah", occasion: "imlek", Component: D.ImlekLampion,
    defaults: { to: "Untuk Koh Willy sekeluarga", headline: "Selamat Tahun Baru Imlek", message: "Semoga rezeki melimpah,\nsehat, dan bahagia sepanjang tahun.", from: "Rina" },
  },
];

export const getCardTemplate = (id: string) => CARD_TEMPLATES.find((t) => t.id === id) ?? CARD_TEMPLATES[0];
