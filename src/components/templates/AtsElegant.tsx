import { splitList, type CvData } from "@/lib/cv";
import { tr } from "@/lib/cv-labels";
import { Bullets, contactItems, dateRange } from "./parts";

/** ATS Elegan — serif modern untuk nama & judul, garis emas tipis, tetap 1 kolom. */
export default function AtsElegant({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);
  return (
    <article className="tpl-elegant">
      <header>
        <h1>{p.fullName || tr(data, "Nama Lengkap")}</h1>
        {p.headline && <p className="headline">{p.headline}</p>}
        <p className="contact">{contactItems(p).join("  ·  ")}</p>
      </header>
      {p.summary && (<section><h2>{tr(data, "Ringkasan")}</h2><p>{p.summary}</p></section>)}
      {data.experience.length > 0 && (
        <section>
          <h2>{tr(data, "Pengalaman")}</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="item">
              <div className="row"><h3>{e.role}</h3><span className="date">{dateRange(e.start, e.end)}</span></div>
              <p className="at">{[e.company, e.location].filter(Boolean).join(" · ")}</p>
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
              <div className="row"><h3>{e.degree}</h3><span className="date">{dateRange(e.start, e.end)}</span></div>
              <p className="at">{[e.school, e.notes].filter(Boolean).join(" · ")}</p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (<section><h2>{tr(data, "Keahlian")}</h2><p>{skills.join(" · ")}</p></section>)}
      {data.certifications.length > 0 && (
        <section><h2>{tr(data, "Sertifikasi")}</h2>
          {data.certifications.map((c) => <p key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}{c.year && ` (${c.year})`}</p>)}
        </section>
      )}
      {langs.length > 0 && (<section><h2>{tr(data, "Bahasa")}</h2><p>{langs.join(" · ")}</p></section>)}
    </article>
  );
}
