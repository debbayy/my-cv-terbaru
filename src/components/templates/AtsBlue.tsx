import { splitList, type CvData } from "@/lib/cv";
import { tr } from "@/lib/cv-labels";
import { Bullets, contactItems, dateRange } from "./parts";

/** ATS Biru Tegas — nama biru besar, judul bagian dengan blok biru di kiri. */
export default function AtsBlue({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);
  return (
    <article className="tpl-blue">
      <header>
        <h1>{p.fullName || tr(data, "Nama Lengkap")}</h1>
        {p.headline && <p className="headline">{p.headline}</p>}
        <p className="contact">{contactItems(p).join("  |  ")}</p>
      </header>
      {p.summary && (<section><h2>{tr(data, "Ringkasan Profesional")}</h2><p>{p.summary}</p></section>)}
      {skills.length > 0 && (<section><h2>{tr(data, "Keahlian Utama")}</h2><p>{skills.join(", ")}</p></section>)}
      {data.experience.length > 0 && (
        <section>
          <h2>{tr(data, "Pengalaman Kerja")}</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="item">
              <div className="row"><h3>{e.role} — {e.company}</h3><span className="date">{dateRange(e.start, e.end)}</span></div>
              {e.location && <p className="muted">{e.location}</p>}
              <Bullets text={e.bullets} />
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <h2>{tr(data, "Pendidikan")}</h2>
          {data.education.map((e) => (
            <div key={e.id} className="item">
              <div className="row"><h3>{e.degree} — {e.school}</h3><span className="date">{dateRange(e.start, e.end)}</span></div>
              {e.notes && <p className="muted">{e.notes}</p>}
            </div>
          ))}
        </section>
      )}
      {(data.certifications.length > 0 || langs.length > 0) && (
        <section>
          <h2>{tr(data, "Lainnya")}</h2>
          {data.certifications.length > 0 && <p><strong>{tr(data, "Sertifikasi:")}</strong> {data.certifications.map((c) => [c.name, c.issuer, c.year].filter(Boolean).join(", ")).join("; ")}</p>}
          {langs.length > 0 && <p><strong>{tr(data, "Bahasa:")}</strong> {langs.join(", ")}</p>}
        </section>
      )}
    </article>
  );
}
