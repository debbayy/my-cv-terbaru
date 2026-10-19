import type { ComponentType } from "react";
import type { CvData } from "@/lib/cv";
import type { Tier } from "@/lib/plans";
import AtsClassic from "@/components/templates/AtsClassic";
import AtsModern from "@/components/templates/AtsModern";
import Creative from "@/components/templates/Creative";
import AtsMinimal from "@/components/templates/AtsMinimal";
import AtsExecutive from "@/components/templates/AtsExecutive";
import AtsFresh from "@/components/templates/AtsFresh";
import ModernHeader from "@/components/templates/ModernHeader";
import BoldTimeline from "@/components/templates/BoldTimeline";
import AtsElegant from "@/components/templates/AtsElegant";
import AtsBlue from "@/components/templates/AtsBlue";
import PastelSoft from "@/components/templates/PastelSoft";
import DarkPro from "@/components/templates/DarkPro";

export type TemplateDef = {
  id: string;
  name: string;
  description: string;
  ats: boolean;
  Component: ComponentType<{ data: CvData }>;
  /** Margin halaman PDF. Template full-bleed (sidebar berwarna) pakai 0. */
  pdfMargin: { top: string; right: string; bottom: string; left: string };
  /** Diisi otomatis: 2 pertama di tiap kategori (ATS / desain bebas) = "pro", sisanya "promax". */
  tier: Tier;
};

const STD = { top: "14mm", right: "16mm", bottom: "14mm", left: "16mm" };
const NONE = { top: "0", right: "0", bottom: "0", left: "0" };

const RAW: Omit<TemplateDef, "tier">[] = [
  {
    id: "ats-classic",
    name: "ATS Classic",
    description: "Satu kolom, rapi dan formal. Paling aman lolos ATS.",
    ats: true,
    Component: AtsClassic,
    pdfMargin: STD,
  },
  {
    id: "ats-modern",
    name: "ATS Modern",
    description: "Tetap ramah ATS dengan aksen warna dan font modern.",
    ats: true,
    Component: AtsModern,
    pdfMargin: STD,
  },
  {
    id: "ats-minimal",
    name: "ATS Minimalis",
    description: "Padat dan bersih, muat banyak isi dalam 1 halaman.",
    ats: true,
    Component: AtsMinimal,
    pdfMargin: STD,
  },
  {
    id: "ats-executive",
    name: "ATS Profesional",
    description: "Serif klasik untuk posisi senior, korporat, dan perbankan.",
    ats: true,
    Component: AtsExecutive,
    pdfMargin: STD,
  },
  {
    id: "ats-fresh",
    name: "ATS Fresh Graduate",
    description: "Pendidikan & keahlian di atas — pas untuk lulusan baru dan magang.",
    ats: true,
    Component: AtsFresh,
    pdfMargin: STD,
  },
  {
    id: "creative",
    name: "Creative Sidebar",
    description: "Dua kolom berwarna, cocok untuk kirim langsung ke HR atau portofolio.",
    ats: false,
    Component: Creative,
    pdfMargin: NONE,
  },
  {
    id: "modern-header",
    name: "Modern Header",
    description: "Header biru tua penuh dengan kolom samping — tampil beda di mata HR.",
    ats: false,
    Component: ModernHeader,
    pdfMargin: NONE,
  },
  {
    id: "bold-timeline",
    name: "Bold Timeline",
    description: "Nama besar dan aksen kuning, cocok untuk industri kreatif.",
    ats: false,
    Component: BoldTimeline,
    pdfMargin: STD,
  },
  {
    id: "ats-elegant", name: "ATS Elegan", description: "Serif modern dengan aksen emas — rapi, berkelas, tetap ramah ATS.",
    ats: true, Component: AtsElegant, pdfMargin: STD,
  },
  {
    id: "ats-blue", name: "ATS Biru Tegas", description: "Nama besar & judul bagian berwarna biru, keahlian ditaruh di atas.",
    ats: true, Component: AtsBlue, pdfMargin: STD,
  },
  {
    id: "pastel-soft", name: "Pastel Soft", description: "Kolom pastel membulat — lembut & ramah, cocok untuk pendidikan, HR, kreatif.",
    ats: false, Component: PastelSoft, pdfMargin: NONE,
  },
  {
    id: "dark-pro", name: "Dark Pro", description: "Sidebar gelap aksen hijau limau — kesan tech & modern.",
    ats: false, Component: DarkPro, pdfMargin: NONE,
  },
];

/** Jumlah template per kategori yang bisa di-download paket Pro. */
export const PRO_PER_CATEGORY = 2;

const withTier = <T extends { ats: boolean }>(list: T[]) => {
  const seen = { ats: 0, free: 0 };
  return list.map((t) => {
    const k = t.ats ? "ats" : "free";
    seen[k] += 1;
    return { ...t, tier: (seen[k] <= PRO_PER_CATEGORY ? "pro" : "promax") as Tier };
  });
};

export const TEMPLATES: TemplateDef[] = withTier(RAW);

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
