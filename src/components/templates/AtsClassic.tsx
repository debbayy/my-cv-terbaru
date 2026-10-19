import { splitList, type CvData } from "@/lib/cv";
import { tr } from "@/lib/cv-labels";
import { Bullets, contactItems, dateRange } from "./parts";

/** ATS Classic — 1 kolom, serif untuk nama, tanpa ikon/tabel. Paling aman untuk ATS. */
export default function AtsClassic({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);

  return (
    <article className="tpl-classic">
      <header>
        <h1>{p.fullName || tr(data, "Nama Lengkap")}</h1>
        {p.headline && <p className="headline">{p.headline}</p>}
        <p className="contact">{contactItems(p).join("  |  ")}</p>
      </header>

      {p.summary && (
        <section>
          <h2>{tr(data, "Ringkasan")}</h2>
          <p>{p.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h2>{tr(data, "Pengalaman Kerja")}</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="item">
              <div className="row">
                <strong>{e.role}</strong>
                <span>{dateRange(e.start, e.end)}</span>
              </div>
              <div className="row sub">
                <span>{e.company}</span>
                <span>{e.location}</span>
              </div>
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
              <div className="row">
                <strong>{e.school}</strong>
                <span>{dateRange(e.start, e.end)}</span>
              </div>
              <div className="row sub">
                <span>{[e.degree, e.notes].filter(Boolean).join(" — ")}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {(skills.length > 0 || langs.length > 0) && (
        <section>
          <h2>{tr(data, "Keahlian")}</h2>
          {skills.length > 0 && <p><strong>{tr(data, "Teknis:")}</strong> {skills.join(", ")}</p>}
          {langs.length > 0 && <p><strong>{tr(data, "Bahasa:")}</strong> {langs.join(", ")}</p>}
        </section>
      )}

      {data.certifications.length > 0 && (
        <section>
          <h2>{tr(data, "Sertifikasi")}</h2>
          <ul>
            {data.certifications.map((c) => (
              <li key={c.id}>
                {c.name}
                {c.issuer && ` — ${c.issuer}`}
                {c.year && ` (${c.year})`}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
