import type { ComponentType } from "react";
import type { CvData } from "@/lib/cv";
import AtsClassic from "@/components/templates/AtsClassic";
import AtsModern from "@/components/templates/AtsModern";
import Creative from "@/components/templates/Creative";

export type TemplateDef = {
  id: string;
  name: string;
  description: string;
  ats: boolean;
  Component: ComponentType<{ data: CvData }>;
  /** Margin halaman PDF. Template full-bleed (sidebar berwarna) pakai 0. */
  pdfMargin: { top: string; right: string; bottom: string; left: string };
};

const STD = { top: "14mm", right: "16mm", bottom: "14mm", left: "16mm" };
const NONE = { top: "0", right: "0", bottom: "0", left: "0" };

export const TEMPLATES: TemplateDef[] = [
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
    id: "creative",
    name: "Creative Sidebar",
    description: "Dua kolom berwarna, cocok untuk kirim langsung ke HR atau portofolio.",
    ats: false,
    Component: Creative,
    pdfMargin: NONE,
  },
];

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
