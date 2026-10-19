"use client";
import Spinner from "@/components/ui/Spinner";
import { useState } from "react";
import { emptyCv, uid, type Certification, type CvData, type Education, type Experience } from "@/lib/cv";
import { photoToDataUrl } from "@/lib/photo";
import AtsChecker from "./AtsChecker";

type Props = { data: CvData; onChange: (d: CvData) => void };

function Field({
  label, value, onChange, placeholder, textarea, rows = 3, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  textarea?: boolean; rows?: number; hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {textarea ? (
        <textarea className="input resize-y" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-xl border border-line bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold">
        {title}
        <span className="text-muted transition group-open:rotate-180">▾</span>
      </summary>
      <div className="space-y-3 border-t border-line px-4 py-4">{children}</div>
    </details>
  );
}

/** Helper list item: tambah / hapus / naik / turun */
function ListControls({ onUp, onDown, onRemove }: { onUp?: () => void; onDown?: () => void; onRemove: () => void }) {
  return (
    <div className="flex gap-1 text-xs">
      <button type="button" disabled={!onUp} onClick={onUp} className="rounded px-1.5 py-0.5 text-muted hover:bg-paper disabled:opacity-30">↑</button>
      <button type="button" disabled={!onDown} onClick={onDown} className="rounded px-1.5 py-0.5 text-muted hover:bg-paper disabled:opacity-30">↓</button>
      <button type="button" onClick={onRemove} className="rounded px-1.5 py-0.5 text-red-600 hover:bg-red-50">Hapus</button>
    </div>
  );
}

function listOps<T extends { id: string }>(items: T[], set: (items: T[]) => void) {
  const update = (id: string, patch: Partial<T>) => set(items.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const remove = (id: string) => set(items.filter((x) => x.id !== id));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    set(next);
  };
  return { update, remove, move };
}

export default function CvForm({ data, onChange }: Props) {
  const p = data.personal;
  const setP = (patch: Partial<CvData["personal"]>) => onChange({ ...data, personal: { ...p, ...patch } });
  const [photoErr, setPhotoErr] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setPhotoErr("File harus berupa gambar (JPG/PNG).");
    setPhotoErr(null);
    setPhotoBusy(true);
    try { setP({ photo: await photoToDataUrl(f) }); } catch { setPhotoErr("Gagal membaca foto. Coba foto lain."); }
    finally { setPhotoBusy(false); }
  }

  const exp = listOps<Experience>(data.experience, (experience) => onChange({ ...data, experience }));
  const edu = listOps<Education>(data.education, (education) => onChange({ ...data, education }));
  const cert = listOps<Certification>(data.certifications, (certifications) => onChange({ ...data, certifications }));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-white px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">Bahasa CV</span>
          <div className="inline-flex rounded-lg border border-line p-0.5">
            {(["id", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onChange({ ...data, lang: l })}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${(data.lang ?? "id") === l ? "bg-brand text-white" : "text-muted"}`}
              >
                {l === "id" ? "Indonesia" : "English"}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="text-xs text-muted underline"
          onClick={() => window.confirm("Hapus semua isian (termasuk contoh) dan mulai dari kosong?") && onChange({ ...emptyCv(), lang: data.lang })}
        >
          Mulai dari kosong
        </button>
      </div>

      <Section title="Data Diri">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-paper text-xs text-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.photo ? <img src={p.photo} alt="Pas foto" className="h-full w-full object-cover" /> : "Foto"}
          </div>
          <div className="min-w-0 text-sm">
            <label className={`btn-ghost cursor-pointer py-1.5 ${photoBusy ? "pointer-events-none opacity-60" : ""}`} aria-busy={photoBusy}>
              {photoBusy && <Spinner className="h-3.5 w-3.5" />}
              {photoBusy ? "Memproses foto…" : p.photo ? "Ganti foto" : "Upload pas foto"}
              <input type="file" accept="image/*" disabled={photoBusy} className="hidden" onChange={pickPhoto} />
            </label>
            {p.photo && <button type="button" className="ml-2 text-xs text-red-600" onClick={() => setP({ photo: undefined })}>Hapus</button>}
            <p className="mt-1 text-[11px] text-muted">Tampil di template desain bebas. Untuk lamaran via ATS sebaiknya tanpa foto.</p>
            {photoErr && <p className="text-[11px] text-red-600">{photoErr}</p>}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nama lengkap" value={p.fullName} onChange={(v) => setP({ fullName: v })} />
          <Field label="Posisi / headline" value={p.headline} onChange={(v) => setP({ headline: v })} placeholder="Frontend Developer" />
          <Field label="Email" value={p.email} onChange={(v) => setP({ email: v })} />
          <Field label="No. HP" value={p.phone} onChange={(v) => setP({ phone: v })} />
          <Field label="Domisili" value={p.location} onChange={(v) => setP({ location: v })} placeholder="Jakarta Selatan" />
          <Field label="Link (pisah koma)" value={p.links} onChange={(v) => setP({ links: v })} placeholder="linkedin.com/in/kamu, github.com/kamu" />
        </div>
        <Field
          label="Ringkasan" textarea rows={4} value={p.summary} onChange={(v) => setP({ summary: v })}
          hint="2–4 kalimat: siapa kamu, pengalaman berapa tahun, keahlian utama, dan nilai yang kamu bawa."
        />
      </Section>

      <Section title={`Pengalaman Kerja (${data.experience.length})`}>
        {data.experience.map((e, i) => (
          <div key={e.id} className="space-y-3 rounded-lg border border-line bg-paper/50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{e.role || "Posisi baru"}</p>
              <ListControls
                onUp={i > 0 ? () => exp.move(i, -1) : undefined}
                onDown={i < data.experience.length - 1 ? () => exp.move(i, 1) : undefined}
                onRemove={() => exp.remove(e.id)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Posisi" value={e.role} onChange={(v) => exp.update(e.id, { role: v })} />
              <Field label="Perusahaan" value={e.company} onChange={(v) => exp.update(e.id, { company: v })} />
              <Field label="Mulai" value={e.start} onChange={(v) => exp.update(e.id, { start: v })} placeholder="Jan 2023" />
              <Field label="Selesai" value={e.end} onChange={(v) => exp.update(e.id, { end: v })} placeholder="Sekarang" />
              <Field label="Lokasi" value={e.location} onChange={(v) => exp.update(e.id, { location: v })} />
            </div>
            <Field
              label="Pencapaian (satu per baris)" textarea rows={4} value={e.bullets}
              onChange={(v) => exp.update(e.id, { bullets: v })}
              hint="Mulai dengan kata kerja + angka. Contoh: Menurunkan waktu muat halaman 40% dengan …"
            />
          </div>
        ))}
        <button
          type="button" className="btn-ghost w-full"
          onClick={() => onChange({ ...data, experience: [...data.experience, { id: uid(), role: "", company: "", location: "", start: "", end: "", bullets: "" }] })}
        >
          + Tambah pengalaman
        </button>
      </Section>

      <Section title={`Pendidikan (${data.education.length})`}>
        {data.education.map((e, i) => (
          <div key={e.id} className="space-y-3 rounded-lg border border-line bg-paper/50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{e.school || "Pendidikan baru"}</p>
              <ListControls
                onUp={i > 0 ? () => edu.move(i, -1) : undefined}
                onDown={i < data.education.length - 1 ? () => edu.move(i, 1) : undefined}
                onRemove={() => edu.remove(e.id)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Kampus / sekolah" value={e.school} onChange={(v) => edu.update(e.id, { school: v })} />
              <Field label="Jurusan / gelar" value={e.degree} onChange={(v) => edu.update(e.id, { degree: v })} placeholder="S1 Sistem Informasi" />
              <Field label="Mulai" value={e.start} onChange={(v) => edu.update(e.id, { start: v })} />
              <Field label="Lulus" value={e.end} onChange={(v) => edu.update(e.id, { end: v })} />
            </div>
            <Field label="Catatan (opsional)" value={e.notes} onChange={(v) => edu.update(e.id, { notes: v })} placeholder="IPK 3,5 · Cum laude" />
          </div>
        ))}
        <button
          type="button" className="btn-ghost w-full"
          onClick={() => onChange({ ...data, education: [...data.education, { id: uid(), school: "", degree: "", start: "", end: "", notes: "" }] })}
        >
          + Tambah pendidikan
        </button>
      </Section>

      <Section title="Keahlian & Bahasa">
        <Field
          label="Keahlian (pisah koma)" textarea rows={2} value={data.skills} onChange={(v) => onChange({ ...data, skills: v })}
          hint="Pakai istilah yang sama persis dengan lowongan — ATS mencocokkan kata kunci."
        />
        <Field label="Bahasa (pisah koma)" value={data.languages} onChange={(v) => onChange({ ...data, languages: v })} placeholder="Indonesia (Native), Inggris (Menengah)" />
      </Section>

      <Section title="🎯 Cek kecocokan dengan lowongan" defaultOpen={false}>
        <AtsChecker
          data={data}
          onAddSkill={(k) => onChange({ ...data, skills: [data.skills, k].filter((x) => x.trim()).join(", ") })}
        />
      </Section>

      <Section title={`Sertifikasi (${data.certifications.length})`} defaultOpen={false}>
        {data.certifications.map((c, i) => (
          <div key={c.id} className="space-y-2 rounded-lg border border-line bg-paper/50 p-3">
            <div className="flex justify-end">
              <ListControls
                onUp={i > 0 ? () => cert.move(i, -1) : undefined}
                onDown={i < data.certifications.length - 1 ? () => cert.move(i, 1) : undefined}
                onRemove={() => cert.remove(c.id)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Nama" value={c.name} onChange={(v) => cert.update(c.id, { name: v })} />
              <Field label="Penerbit" value={c.issuer} onChange={(v) => cert.update(c.id, { issuer: v })} />
              <Field label="Tahun" value={c.year} onChange={(v) => cert.update(c.id, { year: v })} />
            </div>
          </div>
        ))}
        <button
          type="button" className="btn-ghost w-full"
          onClick={() => onChange({ ...data, certifications: [...data.certifications, { id: uid(), name: "", issuer: "", year: "" }] })}
        >
          + Tambah sertifikasi
        </button>
      </Section>
    </div>
  );
}
