import { splitList, type CvData } from "@/lib/cv";
import { Bullets, contactItems, dateRange } from "./parts";

/**
 * ATS Fresh Graduate — urutan disesuaikan untuk lulusan baru:
 * Pendidikan & Keahlian di atas, lalu Pengalaman/Organisasi/Magang.
 */
export default function AtsFresh({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);

  return (
    <article className="tpl-fresh">
      <header>
        <h1>{p.fullName || "Nama Lengkap"}</h1>
        {p.headline && <p className="headline">{p.headline}</p>}
        <p className="contact">{contactItems(p).join("  |  ")}</p>
      </header>

      {p.summary && (
        <section>
          <h2>Tentang Saya</h2>
          <p>{p.summary}</p>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <h2>Pendidikan</h2>
          {data.education.map((e) => (
            <div key={e.id} className="item">
              <div className="row">
                <h3>{e.school}</h3>
                <span className="date">{dateRange(e.start, e.end)}</span>
              </div>
              <p>{e.degree}</p>
              {e.notes && <p className="muted">{e.notes}</p>}
            </div>
          ))}
        </section>
      )}

      {(skills.length > 0 || langs.length > 0) && (
        <section>
          <h2>Keahlian</h2>
          {skills.length > 0 && <p><strong>Hard skill:</strong> {skills.join(", ")}</p>}
          {langs.length > 0 && <p><strong>Bahasa:</strong> {langs.join(", ")}</p>}
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h2>Pengalaman, Magang &amp; Organisasi</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="item">
              <div className="row">
                <h3>{e.role}</h3>
                <span className="date">{dateRange(e.start, e.end)}</span>
              </div>
              <p className="muted">{[e.company, e.location].filter(Boolean).join(" — ")}</p>
              <Bullets text={e.bullets} />
            </div>
          ))}
        </section>
      )}

      {data.certifications.length > 0 && (
        <section>
          <h2>Sertifikasi &amp; Pelatihan</h2>
          <ul>
            {data.certifications.map((c) => (
              <li key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}{c.year && ` (${c.year})`}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
