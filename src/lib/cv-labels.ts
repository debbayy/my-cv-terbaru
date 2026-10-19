import type { CvData } from "@/lib/cv";

/** Terjemahan judul bagian CV ke Inggris. Kunci = teks Indonesia yang dipakai template. */
const EN: Record<string, string> = {
  "Nama Lengkap": "Full Name",
  Pendidikan: "Education",
  Pengalaman: "Experience",
  "Pengalaman Kerja": "Work Experience",
  Sertifikasi: "Certifications",
  Keahlian: "Skills",
  Bahasa: "Languages",
  Ringkasan: "Summary",
  Profil: "Profile",
  Kontak: "Contact",
  "Tentang Saya": "About Me",
  Lainnya: "Additional",
  "Bahasa:": "Languages:",
  "Sertifikasi:": "Certifications:",
  "Teknis:": "Technical:",
  "Hard skill:": "Hard skills:",
  "// kontak": "// contact",
  "// keahlian": "// skills",
  "// bahasa": "// languages",
  "Sertifikasi & Pelatihan": "Certifications & Training",
  "Riwayat Pekerjaan": "Professional Experience",
  "Ringkasan Profesional": "Professional Summary",
  "Profil Profesional": "Professional Profile",
  "Pengalaman, Magang & Organisasi": "Experience, Internships & Organizations",
  "Kompetensi Inti": "Core Competencies",
  "Keahlian Utama": "Key Skills",
  "Informasi Tambahan": "Additional Information",
};

export type CvLang = "id" | "en";

/** tr(data, "Pendidikan") → "Education" kalau CV diset bahasa Inggris. */
export const tr = (data: Pick<CvData, "lang">, s: string) => (data.lang === "en" ? EN[s] ?? s : s);
