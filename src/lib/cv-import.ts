import { emptyCv, uid, type CvData, type Education, type Experience, type Certification } from "@/lib/cv";

/**
 * Mengubah teks CV lama (hasil ekstrak PDF/DOCX) menjadi CvData — heuristik, tanpa AI/layanan luar.
 * Mengenali judul bagian Indonesia & Inggris. Hasilnya tebakan terbaik; user tetap bisa mengoreksi di editor.
 */

export type ImportResult = {
  data: CvData;
  found: { personal: boolean; summary: boolean; experience: number; education: number; skills: number; certifications: number };
  warnings: string[];
};

type Section = "summary" | "experience" | "education" | "skills" | "languages" | "certifications" | "ignore";

const HEADERS: Record<Section, string[]> = {
  summary: ["ringkasan", "ringkasan profesional", "ringkasan profil", "profil", "profil singkat", "profil profesional", "tentang saya", "tentang", "tujuan karir", "tujuan karier", "profile", "summary", "professional summary", "career summary", "about me", "about", "objective", "career objective", "personal statement"],
  experience: ["pengalaman", "pengalaman kerja", "pengalaman profesional", "riwayat pekerjaan", "riwayat kerja", "pengalaman magang", "experience", "work experience", "professional experience", "employment history", "employment", "work history", "career history", "internship"],
  education: ["pendidikan", "riwayat pendidikan", "pendidikan formal", "pendidikan dan pelatihan", "education", "academic background", "academic", "education and training", "educational background"],
  skills: ["keahlian", "keterampilan", "kemampuan", "kompetensi", "keahlian teknis", "keahlian utama", "skill", "skills", "technical skills", "hard skills", "soft skills", "core skills", "key skills", "core competencies", "competencies", "technologies", "tech stack", "tools"],
  languages: ["bahasa", "kemampuan bahasa", "bahasa asing", "languages", "language skills", "language"],
  certifications: ["sertifikasi", "sertifikat", "pelatihan", "kursus", "pelatihan dan sertifikasi", "certifications", "certification", "certificates", "licenses", "licenses and certifications", "courses", "training", "training and certifications"],
  ignore: ["organisasi", "pengalaman organisasi", "kegiatan", "prestasi", "penghargaan", "referensi", "minat", "hobi", "publikasi", "proyek", "projects", "project", "awards", "achievements", "references", "interests", "hobbies", "publications", "volunteer", "volunteering", "activities", "extracurricular", "data pribadi", "personal details", "personal information", "informasi tambahan", "additional information", "kontak", "contact", "contact information", "kontak saya"],
};

const HEADER_MAP = new Map<string, Section>();
(Object.keys(HEADERS) as Section[]).forEach((s) => HEADERS[s].forEach((h) => HEADER_MAP.set(h, s)));
const EN_HEADERS = new Set(["summary", "professional summary", "profile", "about me", "objective", "experience", "work experience", "professional experience", "employment history", "work history", "education", "skills", "technical skills", "languages", "certifications", "certificates", "courses", "training"]);

const MONTHS: Record<string, string> = {
  jan: "Jan", january: "Jan", januari: "Jan", feb: "Feb", february: "Feb", februari: "Feb", mar: "Mar", march: "Mar", maret: "Mar",
  apr: "Apr", april: "Apr", may: "Mei", mei: "Mei", jun: "Jun", june: "Jun", juni: "Jun", jul: "Jul", july: "Jul", juli: "Jul",
  aug: "Agu", august: "Agu", agu: "Agu", agt: "Agu", agustus: "Agu", sep: "Sep", sept: "Sep", september: "Sep",
  oct: "Okt", october: "Okt", okt: "Okt", oktober: "Okt", nov: "Nov", november: "Nov", nopember: "Nov", dec: "Des", december: "Des", des: "Des", desember: "Des",
};
const MONTH_NUM = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const MON = "(?:jan(?:uari|uary)?|feb(?:ruari|ruary)?|mar(?:et|ch)?|apr(?:il)?|mei|may|jun(?:i|e)?|jul(?:i|y)?|agu(?:stus)?|agt|aug(?:ust)?|sep(?:t(?:ember)?)?|okt(?:ober)?|oct(?:ober)?|nov(?:ember)?|nopember|des(?:ember)?|dec(?:ember)?)";
const PRESENT = "(?:sekarang|saat ini|sampai sekarang|hingga sekarang|present|now|current|ongoing|sekarang ini|s\\.?d\\.? sekarang)";
const POINT = `(?:${MON}\\.?\\s+(?:19|20)\\d{2}|(?:0?[1-9]|1[0-2])\\s*[/.\\-]\\s*(?:19|20)\\d{2}|(?:19|20)\\d{2})`;
const SEP = "\\s*(?:-|–|—|−|to|until|sampai|hingga|s\\.?d\\.?|/)\\s*";
const RANGE_RE = new RegExp(`(${POINT})(?:${SEP}(${POINT}|${PRESENT}))?`, "i");
const RANGE_STRICT_RE = new RegExp(`(${POINT})${SEP}(${POINT}|${PRESENT})`, "i");

const EMAIL_RE = /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/;
const PHONE_RE = /(?:\+?62|0)[\s\-.()]*8[\s\-.()]*\d(?:[\s\-.()]*\d){7,11}|\+\d{1,3}[\s\-.()]*\d(?:[\s\-.()]*\d){7,12}/;
const URL_RE = /(?:https?:\/\/|www\.)[^\s,;|)]+|(?:linkedin\.com|github\.com|gitlab\.com|behance\.net|dribbble\.com|medium\.com|bit\.ly)\/[^\s,;|)]+|[a-z0-9\-]+\.(?:dev|io|me|id|com|co\.id|net|app|site|tech)(?:\/[^\s,;|)]*)?/gi;

const BULLET_RE = /^\s*(?:[•●▪■◦○▫►▶➢➤✓✔*·\-–—]|\d{1,2}[.)])\s+/;
const ROLE_HINT = /\b(developer|engineer|manager|designer|analyst|intern|internship|magang|staff|admin|administrator|specialist|lead|officer|consultant|director|supervisor|programmer|akuntan|accountant|marketing|sales|asisten|assistant|coordinator|koordinator|executive|architect|tester|qa|writer|editor|teacher|guru|dosen|lecturer|freelance|freelancer|head|kepala|sekretaris|secretary|technician|teknisi|operator|associate|representative|trainee|researcher|scientist|product owner|scrum master|ui\/ux|frontend|front-end|backend|back-end|fullstack|full-stack|mobile|devops|cashier|kasir|barista|pramuniaga|customer service|cs)\b/i;
const COMPANY_HINT = /\b(pt|cv|ud|pd|tbk|inc|ltd|llc|corp|corporation|company|co\.|gmbh|pte|bank|group|grup|startup|studio|agency|agensi|technologies|technology|teknologi|solutions|solusi|digital|labs|systems|sistem|university|universitas|institute|institut|school|sekolah|hospital|rumah sakit|kementerian|dinas|yayasan|foundation|koperasi|toko|restoran|hotel|media|indonesia|nusantara)\b/i;
const SCHOOL_HINT = /\b(universitas|university|institut|institute|politeknik|polytechnic|sekolah|school|college|akademi|academy|sma|smk|smp|stmik|stikom|bootcamp|univ|uin|ui|itb|ugm|its|binus|telkom)\b/i;
const DEGREE_HINT = /\b(s1|s2|s3|d1|d2|d3|d4|sarjana|magister|diploma|bachelor|master|doctor|phd|sma|smk|b\.?sc|m\.?sc|b\.?eng|teknik|informatika|sistem informasi|ilmu komputer|computer science|manajemen|akuntansi|ekonomi|desain|jurusan|major|program studi|prodi|ipa|ips|gpa|ipk)\b/i;
const LOCATION_HINT = /\b(remote|hybrid|onsite|on-site|jakarta|bandung|surabaya|yogyakarta|jogja|medan|semarang|bali|denpasar|tangerang|bekasi|depok|bogor|malang|makassar|palembang|batam|solo|surakarta|balikpapan|pontianak|indonesia|jawa|sumatera|kalimantan|sulawesi)\b/i;

const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const stripBullet = (s: string) => s.replace(BULLET_RE, "").trim();
const isBullet = (s: string) => BULLET_RE.test(s);
const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s\-'.])([a-zà-ÿ])/g, (_, a, b) => a + b.toUpperCase());
const isAllCaps = (s: string) => /[A-Z]/.test(s) && s === s.toUpperCase();

function normalizePoint(raw: string): string {
  const s = raw.trim();
  if (new RegExp(`^${PRESENT}$`, "i").test(s)) return "Sekarang";
  const m1 = s.match(new RegExp(`^(${MON})\\.?\\s+((?:19|20)\\d{2})$`, "i"));
  if (m1) return `${MONTHS[m1[1].toLowerCase()] ?? m1[1]} ${m1[2]}`;
  const m2 = s.match(/^(0?[1-9]|1[0-2])\s*[/.\-]\s*((?:19|20)\d{2})$/);
  if (m2) return `${MONTH_NUM[Number(m2[1]) - 1]} ${m2[2]}`;
  return s;
}

function sectionOf(line: string): Section | null {
  const t = clean(line).replace(/[:：\-–—_=|]+$/g, "").replace(/^[\-–—_=|\s]+/, "").trim().toLowerCase();
  if (!t || t.length > 42) return null;
  const direct = HEADER_MAP.get(t);
  if (direct) return direct;
  // "WORK EXPERIENCE & PROJECTS" / "Pendidikan & Pelatihan": cek kata pertama sebelum & / dan
  const first = t.split(/\s*(?:&|\/|,|\bdan\b|\band\b)\s*/)[0];
  if (first !== t && HEADER_MAP.has(first) && line === line.toUpperCase()) return HEADER_MAP.get(first)!;
  return null;
}

const splitParts = (s: string) => s.split(/\s*(?:\||•|·|—|–|\s-\s|@|\bat\b|\bdi\b|•)\s*/i).map(clean).filter(Boolean);

type Entry = { header: string[]; dateText: string; bullets: string[] };

/** Pecah isi satu bagian menjadi entri berdasarkan baris yang memuat tanggal. */
function segmentEntries(lines: string[], strictRange: boolean): Entry[] {
  const re = strictRange ? RANGE_STRICT_RE : RANGE_RE;
  const L = lines.map((l) => l.trim()).filter(Boolean);
  const isAnchor = (i: number) => {
    const l = L[i];
    if (!l || isBullet(l)) return false;
    const m = l.match(re);
    if (!m) return false;
    // Baris pendek / diawali tanggal / ada pemisah → bukan kalimat biasa yang kebetulan menyebut tahun
    const rest = clean(l.replace(m[0], "").replace(/[()\[\]|,–—-]/g, " "));
    return rest.length <= 90;
  };
  const anchors = L.map((_, i) => i).filter(isAnchor);
  if (!anchors.length) return [];

  // baris lanjutan dari bullet sebelumnya (teks terbungkus)
  const isContinuation = (i: number) => {
    const prev = L[i - 1];
    if (!prev || !L[i] || isAnchor(i)) return false;
    const prevIsBulletish = isBullet(prev) || prev.length > 60;
    return prevIsBulletish && (/^[a-zà-ÿ(]/.test(L[i]) || /[,;:]$/.test(prev) || !/[.!?]$/.test(prev) && prev.length > 80 && L[i].length > 25);
  };

  const entries: Entry[] = [];
  let prevEnd = -1;
  anchors.forEach((a, k) => {
    const nextAnchor = anchors[k + 1] ?? L.length;
    // baris judul di atas anchor
    const above: string[] = [];
    for (let j = a - 1; j > prevEnd && above.length < 2; j--) {
      if (!L[j]) { if (above.length) break; else continue; }
      if (isBullet(L[j]) || isContinuation(j)) break;
      if (isAnchor(j)) break;
      above.unshift(L[j]);
    }
    const m = L[a].match(re)!;
    const sameLine = clean(L[a].replace(m[0], "").replace(/[()\[\]]/g, " ").replace(/^[\s|,–—\-:]+|[\s|,–—\-:]+$/g, ""));
    let header = [...above];
    if (sameLine) header.push(sameLine);
    let from = a + 1;
    // tanggal di baris sendiri dan tidak ada judul di atas → judul ada di bawah (layout "tanggal dulu")
    if (!header.length || (!sameLine && above.length === 0)) {
      const below: string[] = [];
      let j = a + 1;
      while (j < nextAnchor && below.length < 2 && L[j] && !isBullet(L[j])) below.push(L[j++]);
      header = below; from = j;
    }
    // sisa baris sebelum judul entri berikutnya = bullet
    const nextHeaderStart = (() => {
      if (nextAnchor >= L.length) return L.length;
      let j = nextAnchor, n = 0;
      while (j - 1 > a && n < 2 && L[j - 1] && !isBullet(L[j - 1]) && !isContinuation(j - 1) && !isAnchor(j - 1)) { j--; n++; }
      return j;
    })();
    const body: string[] = [];
    for (let j = from; j < nextHeaderStart; j++) {
      if (!L[j]) continue;
      if (isBullet(L[j])) body.push(stripBullet(L[j]));
      else if (body.length && (isContinuation(j) || body.length)) body[body.length - 1] = clean(`${body[body.length - 1]} ${L[j]}`);
      else body.push(L[j]);
    }
    entries.push({ header, dateText: m[0], bullets: body });
    prevEnd = nextHeaderStart - 1;
  });
  return entries;
}

function rangeOf(dateText: string): { start: string; end: string } {
  const m = dateText.match(RANGE_RE);
  if (!m) return { start: "", end: "" };
  const start = normalizePoint(m[1]);
  const end = m[2] ? normalizePoint(m[2]) : "";
  return { start, end };
}

function parseExperience(lines: string[]): Experience[] {
  return segmentEntries(lines, false)
    .filter((e) => e.header.length || e.bullets.length)
    .map((e) => {
      const expand = (p: string) => {
        if (!p.includes(",") || LOCATION_HINT.test(p) && !ROLE_HINT.test(p) && !COMPANY_HINT.test(p)) return [p];
        const pc = p.split(/,\s*/).map(clean).filter(Boolean);
        return pc.length === 2 && (ROLE_HINT.test(pc[0]) !== ROLE_HINT.test(pc[1]) || COMPANY_HINT.test(pc[1])) ? pc : [p];
      };
      const parts = e.header.flatMap(splitParts).flatMap(expand);
      let role = "", company = "", location = "";
      const rest: string[] = [];
      for (const p of parts) {
        if (!location && LOCATION_HINT.test(p) && p.length <= 40 && !ROLE_HINT.test(p) && !COMPANY_HINT.test(p.replace(/indonesia|nusantara/gi, ""))) location = p;
        else rest.push(p);
      }
      // tahap 1: berdasarkan petunjuk kata; tahap 2: sisanya mengisi slot kosong sesuai urutan
      role = rest.find((p) => ROLE_HINT.test(p) && !(COMPANY_HINT.test(p) && !/\b(developer|engineer|manager|designer|analyst)\b/i.test(p))) ?? "";
      company = rest.find((p) => p !== role && COMPANY_HINT.test(p)) ?? "";
      const left = rest.filter((p) => p !== role && p !== company);
      if (!role && left.length) role = left.shift()!;
      if (!company && left.length) company = left.shift()!;
      const { start, end } = rangeOf(e.dateText);
      return { id: uid(), role, company, location, start, end: end || (start ? "" : ""), bullets: e.bullets.join("\n") };
    });
}

function parseEducation(lines: string[]): Education[] {
  let entries = segmentEntries(lines, false);
  // tanpa tahun: pecah per blok kosong
  if (!entries.length) {
    const blocks: string[][] = [[]];
    lines.forEach((l) => (l.trim() ? blocks[blocks.length - 1].push(l.trim()) : blocks[blocks.length - 1].length && blocks.push([])));
    entries = blocks.filter((b) => b.length).map((b) => ({ header: b.filter((x) => !isBullet(x)).slice(0, 2), dateText: "", bullets: b.filter(isBullet).map(stripBullet) }));
  }
  return entries
    .filter((e) => e.header.length)
    .map((e) => {
      const expand = (p: string) => {
        const pc = p.split(/,\s*/).map(clean).filter(Boolean);
        return pc.length >= 2 && pc.some((x) => SCHOOL_HINT.test(x)) ? pc : [p];
      };
      const parts = e.header.flatMap(splitParts).flatMap(expand);
      let school = "", degree = "";
      const notes: string[] = [];
      for (const p of parts) {
        if (!school && SCHOOL_HINT.test(p) && !/^(s1|s2|s3|d3|d4)\b/i.test(p)) school = p;
        else if (!degree && DEGREE_HINT.test(p)) degree = p;
        else if (/\b(ipk|gpa|cum laude|nilai|rata-rata)\b/i.test(p)) notes.push(p);
        else if (!school) school = p;
        else if (!degree) degree = p;
        else notes.push(p);
      }
      const { start, end } = rangeOf(e.dateText);
      // tahun tunggal = tahun lulus
      const isSingle = start && !end;
      return {
        id: uid(), school, degree,
        start: isSingle ? "" : start, end: isSingle ? start : end,
        notes: [...notes, ...e.bullets].join("; "),
      };
    });
}

const SKILL_LABEL_RE = /^[A-Za-zÀ-ÿ&/ ]{2,28}:\s+/;
function parseSkills(lines: string[]): string {
  const out: string[] = [];
  for (const raw of lines) {
    let l = stripBullet(raw.trim()).replace(SKILL_LABEL_RE, "");
    if (!l) continue;
    l.split(/\s*(?:,|;|\||•|·|●|▪|•|\s{2,})\s*/).forEach((s) => {
      const t = clean(s.replace(/[:.]$/, ""));
      if (t && t.length <= 40 && !out.some((x) => x.toLowerCase() === t.toLowerCase())) out.push(t);
    });
  }
  return out.slice(0, 40).join(", ");
}

function parseLanguages(lines: string[]): string {
  const out: string[] = [];
  for (const raw of lines) {
    const l = stripBullet(raw.trim());
    if (!l) continue;
    // "Indonesia (Native), English (Fluent)" → pecah di koma yang bukan di dalam kurung
    l.split(/,(?![^(]*\))|;|\|/).forEach((s) => { const t = clean(s); if (t && t.length <= 40) out.push(t); });
  }
  return out.slice(0, 8).join(", ");
}

function parseCerts(lines: string[]): Certification[] {
  const out: Certification[] = [];
  for (const raw of lines) {
    const l = clean(stripBullet(raw.trim()));
    if (!l || l.length < 4) continue;
    const y = l.match(/\b(19|20)\d{2}\b/);
    let rest = clean(l.replace(/[()]/g, " ").replace(y ? y[0] : "", "").replace(/\s[-–—|,]\s*$/g, ""));
    const parts = rest.split(/\s*(?:\||—|–|\s-\s|\boleh\b|\bby\b|,)\s*/i).map(clean).filter(Boolean);
    out.push({ id: uid(), name: parts[0] ?? rest, issuer: parts[1] ?? "", year: y ? y[0] : "" });
  }
  return out.slice(0, 12);
}

export function parseCvText(input: string): ImportResult {
  const warnings: string[] = [];
  const text = input
    .replace(/\r/g, "")
    .replace(/[   ]/g, " ")
    .replace(/[​‌‍﻿]/g, "")
    .replace(/\t+/g, "  ");
  const lines = text.split("\n").map((l) => l.replace(/\s+$/g, ""));

  // 1) bagi per bagian
  const head: string[] = [];
  const sections: { type: Section; lines: string[] }[] = [];
  let cur: { type: Section; lines: string[] } | null = null;
  let enHeaders = 0, idHeaders = 0;
  for (const line of lines) {
    const t = line.trim();
    const sec = t && !isBullet(t) ? sectionOf(t) : null;
    if (sec) {
      const key = t.replace(/[:：]$/, "").toLowerCase();
      if (sec !== "ignore") (EN_HEADERS.has(key) ? enHeaders++ : idHeaders++);
      cur = { type: sec, lines: [] };
      sections.push(cur);
    } else if (cur) cur.lines.push(line);
    else head.push(line);
  }
  const get = (s: Section) => sections.filter((x) => x.type === s).flatMap((x) => x.lines);

  const cv = emptyCv();
  cv.lang = enHeaders > idHeaders ? "en" : "id";

  // 2) data diri dari blok atas (+ cari kontak di seluruh dokumen kalau tidak ada di atas)
  const headText = head.join("\n");
  const scan = (re: RegExp) => headText.match(re)?.[0] ?? text.match(re)?.[0] ?? "";
  cv.personal.email = scan(EMAIL_RE);
  cv.personal.phone = clean(scan(PHONE_RE));
  const urls = [...(headText.match(URL_RE) ?? []), ...(text.match(URL_RE) ?? [])]
    .map((u) => u.replace(/^https?:\/\/(www\.)?/i, "").replace(/^www\./i, "").replace(/[.,;]+$/, ""))
    .filter((u) => !EMAIL_RE.test(u) && !cv.personal.email.toLowerCase().endsWith(u.toLowerCase()) && u.length > 4);
  cv.personal.links = [...new Set(urls)].slice(0, 4).join(", ");

  const stripContacts = (l: string) =>
    clean(l.replace(EMAIL_RE, " ").replace(PHONE_RE, " ").replace(URL_RE, " ").replace(/\b(email|e-mail|telp|telepon|phone|hp|wa|whatsapp|linkedin|github|portfolio)\s*[:：]/gi, " "));
  const headLines = head.map((l) => l.trim()).filter(Boolean);
  const textual = headLines.map(stripContacts).map((l) => l.replace(/^[|•·,\-–—\s]+|[|•·,\-–—\s]+$/g, "")).filter((l) => l.length > 1);

  const nameIdx = textual.findIndex((l) => l.split(" ").length <= 6 && !/\d/.test(l) && !ROLE_HINT.test(l) || (l.split(" ").length <= 4 && !/\d/.test(l)));
  if (nameIdx >= 0) {
    const n = textual[nameIdx];
    cv.personal.fullName = isAllCaps(n) ? titleCase(n) : n;
    const after = textual.slice(nameIdx + 1);
    const hl = after.find((l) => l.length <= 70 && !/\d{4}/.test(l));
    if (hl) cv.personal.headline = isAllCaps(hl) ? titleCase(hl) : hl;
    const locLine = [...after, ...textual].map((l) => splitParts(l).find((p) => LOCATION_HINT.test(p) && p.length <= 45 && p !== cv.personal.headline)).find(Boolean);
    if (locLine) cv.personal.location = locLine;
  }
  if (!cv.personal.fullName) warnings.push("Nama tidak terdeteksi — isi manual.");

  // 3) isi bagian
  const summary = clean(get("summary").map((l) => stripBullet(l.trim())).filter(Boolean).join(" "));
  cv.personal.summary = summary.slice(0, 900);
  cv.experience = parseExperience(get("experience"));
  cv.education = parseEducation(get("education"));
  cv.skills = parseSkills(get("skills"));
  cv.languages = parseLanguages(get("languages"));
  cv.certifications = parseCerts(get("certifications"));

  // CV berbahasa Inggris → tanggal ikut Inggris
  if (cv.lang === "en") {
    const EN_M: Record<string, string> = { Mei: "May", Agu: "Aug", Okt: "Oct", Des: "Dec" };
    const fix = (v: string) => (v === "Sekarang" ? "Present" : v.replace(/^(Mei|Agu|Okt|Des)\b/, (m) => EN_M[m]));
    cv.experience.forEach((e) => { e.start = fix(e.start); e.end = fix(e.end); });
    cv.education.forEach((e) => { e.start = fix(e.start); e.end = fix(e.end); });
  }

  // 4) fallback bila judul bagian tidak dikenali sama sekali
  if (!sections.length) {
    const body = clean(textual.slice(nameIdx + 2).join(" "));
    cv.personal.summary = body.slice(0, 900);
    warnings.push("Judul bagian (Pengalaman, Pendidikan, Keahlian) tidak ditemukan, jadi isi CV lama dimasukkan ke Ringkasan. Pindahkan manual ke bagian yang sesuai.");
  } else {
    if (!cv.experience.length && get("experience").some((l) => l.trim())) warnings.push("Bagian pengalaman ditemukan tapi rinciannya tidak terbaca rapi. Cek dan lengkapi manual.");
    if (!cv.education.length && get("education").some((l) => l.trim())) warnings.push("Bagian pendidikan ditemukan tapi rinciannya tidak terbaca rapi. Cek dan lengkapi manual.");
  }
  if (!cv.personal.email && !cv.personal.phone) warnings.push("Email / nomor HP tidak terdeteksi — isi manual.");

  return {
    data: cv,
    found: {
      personal: !!cv.personal.fullName,
      summary: !!cv.personal.summary,
      experience: cv.experience.length,
      education: cv.education.length,
      skills: cv.skills ? cv.skills.split(",").length : 0,
      certifications: cv.certifications.length,
    },
    warnings,
  };
}
