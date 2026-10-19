import { splitList, type CvData } from "@/lib/cv";
import { Bullets, contactItems, dateRange } from "./parts";

/** ATS Modern — tetap 1 kolom & teks murni, tapi pakai aksen warna dan sans-serif. */
export default function AtsModern({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);

  return (
    <article className="tpl-modern">
      <header>
        <h1>{p.fullName || "Nama Lengkap"}</h1>
        {p.headline && <p className="headline">{p.headline}</p>}
        <p className="contact">{contactItems(p).join("  •  ")}</p>
      </header>

      {p.summary && (
        <section>
          <h2>Profil</h2>
          <p>{p.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h2>Pengalaman</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="item">
              <div className="row">
                <h3>
                  {e.role}
                  {e.company && <span className="at"> · {e.company}</span>}
                </h3>
                <span className="date">{dateRange(e.start, e.end)}</span>
              </div>
              {e.location && <p className="loc">{e.location}</p>}
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
                <h3>
                  {e.degree}
                  {e.school && <span className="at"> · {e.school}</span>}
                </h3>
                <span className="date">{dateRange(e.start, e.end)}</span>
              </div>
              {e.notes && <p className="loc">{e.notes}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2>Keahlian</h2>
          <p>{skills.join(" · ")}</p>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section>
          <h2>Sertifikasi</h2>
          <ul>
            {data.certifications.map((c) => (
              <li key={c.id}>
                {c.name}
                {c.issuer && `, ${c.issuer}`}
                {c.year && ` (${c.year})`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {langs.length > 0 && (
        <section>
          <h2>Bahasa</h2>
          <p>{langs.join(" · ")}</p>
        </section>
      )}
    </article>
  );
}
