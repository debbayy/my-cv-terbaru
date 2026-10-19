import { splitList, type CvData } from "@/lib/cv";
import { Bullets, contactItems, dateRange } from "./parts";

/** ATS Profesional — serif klasik, garis ganda, cocok untuk posisi senior / korporat / perbankan. */
export default function AtsExecutive({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);

  return (
    <article className="tpl-exec">
      <header>
        <h1>{p.fullName || "Nama Lengkap"}</h1>
        {p.headline && <p className="headline">{p.headline}</p>}
        <p className="contact">{contactItems(p).join("   ·   ")}</p>
      </header>

      {p.summary && (
        <section>
          <h2>Profil Profesional</h2>
          <p>{p.summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2>Kompetensi Inti</h2>
          <p>{skills.join("  •  ")}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h2>Riwayat Pekerjaan</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="item">
              <div className="row">
                <h3>{e.company || e.role}</h3>
                <span>{e.location}</span>
              </div>
              <div className="row sub">
                <em>{e.company ? e.role : ""}</em>
                <em>{dateRange(e.start, e.end)}</em>
              </div>
              <Bullets text={e.bullets} />
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <h2>Pendidikan</h2>
          {data.education.map((e) => (
            <div key={e.id} className="item">
              <div className="row">
                <h3>{e.school}</h3>
                <span>{dateRange(e.start, e.end)}</span>
              </div>
              <p><em>{[e.degree, e.notes].filter(Boolean).join(" — ")}</em></p>
            </div>
          ))}
        </section>
      )}

      {(data.certifications.length > 0 || langs.length > 0) && (
        <section>
          <h2>Informasi Tambahan</h2>
          {data.certifications.length > 0 && (
            <p>
              <strong>Sertifikasi:</strong>{" "}
              {data.certifications.map((c) => [c.name, c.issuer, c.year].filter(Boolean).join(", ")).join("; ")}
            </p>
          )}
          {langs.length > 0 && <p><strong>Bahasa:</strong> {langs.join(", ")}</p>}
        </section>
      )}
    </article>
  );
}
