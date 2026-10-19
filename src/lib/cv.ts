export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string; // "Jan 2023"
  end: string; // "Sekarang" atau "Des 2024"
  bullets: string; // satu poin per baris
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  start: string;
  end: string;
  notes: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type CvData = {
  /** Bahasa judul bagian CV */
  lang?: "id" | "en";
  personal: {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    links: string; // pisah koma: linkedin.com/in/x, github.com/x
    summary: string;
    /** Pas foto (data URL JPEG kecil). Hanya tampil di template desain bebas. */
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string; // pisah koma
  languages: string; // pisah koma
  certifications: Certification[];
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyCv = (): CvData => ({
  personal: { fullName: "", headline: "", email: "", phone: "", location: "", links: "", summary: "" },
  experience: [],
  education: [],
  skills: "",
  languages: "",
  certifications: [],
});

/** Data contoh — dipakai di galeri template & sebagai isi awal CV baru. */
export const sampleCv = (): CvData => ({
  personal: {
    fullName: "Rina Pratiwi",
    headline: "Frontend Developer",
    email: "rina.pratiwi@email.com",
    phone: "0812-3456-7890",
    location: "Bandung, Jawa Barat",
    links: "linkedin.com/in/rinapratiwi, github.com/rinapratiwi",
    summary:
      "Frontend Developer dengan 4 tahun pengalaman membangun aplikasi web dan mobile dengan React, Next.js, dan React Native. Terbiasa bekerja dengan TypeScript, design system, dan tim lintas fungsi untuk mengirim fitur yang cepat dan mudah dipakai.",
  },
  experience: [
    {
      id: uid(),
      role: "Frontend Developer",
      company: "PT Logistik Nusantara",
      location: "Jakarta (Remote)",
      start: "Mar 2023",
      end: "Sekarang",
      bullets:
        "Membangun dashboard pelacakan pengiriman dengan Next.js yang dipakai 300+ staf operasional\nMenurunkan waktu muat halaman utama 45% lewat code splitting dan caching TanStack Query\nMenyusun shared component library TypeScript yang dipakai 4 tim produk",
    },
    {
      id: uid(),
      role: "Junior Frontend Developer",
      company: "Startup Edukasi Digital",
      location: "Bandung",
      start: "Jan 2021",
      end: "Feb 2023",
      bullets:
        "Mengembangkan website kelas online dengan React dan Tailwind CSS\nMengintegrasikan payment gateway dan alur checkout untuk 10.000+ pengguna",
    },
  ],
  education: [
    {
      id: uid(),
      school: "Universitas Padjadjaran",
      degree: "S1 Teknik Informatika",
      start: "2016",
      end: "2020",
      notes: "IPK 3,62",
    },
  ],
  skills: "TypeScript, React, Next.js, React Native, Tailwind CSS, TanStack Query, REST API, Git",
  languages: "Indonesia (Native), Inggris (Profesional)",
  certifications: [{ id: uid(), name: "Meta Front-End Developer", issuer: "Coursera", year: "2022" }],
});

export const splitList = (s: string) =>
  s.split(",").map((x) => x.trim()).filter(Boolean);

export const splitLines = (s: string) =>
  s.split("\n").map((x) => x.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);

/** Gabungkan data dari DB dengan default supaya field baru tidak bikin crash. */
export const normalizeCv = (raw: unknown): CvData => {
  const base = emptyCv();
  const d = (raw ?? {}) as Partial<CvData>;
  return {
    ...base,
    ...d,
    personal: { ...base.personal, ...(d.personal ?? {}) },
    experience: d.experience ?? [],
    education: d.education ?? [],
    certifications: d.certifications ?? [],
  };
};
