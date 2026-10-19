import { splitList, type CvData } from "@/lib/cv";
import { tr } from "@/lib/cv-labels";
import { Bullets, dateRange } from "./parts";

/** Creative — 2 kolom dengan sidebar berwarna. Bagus dilihat manusia, KURANG ramah ATS. */
export default function Creative({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);
  const links = splitList(p.links);
  const initials = (p.fullName || "NL")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="tpl-creative">
      <aside>
        <div className="avatar">{p.photo ? <img src={p.photo} alt="" /> : initials}</div>
        <div className="block">
          <h4>{tr(data, "Kontak")}</h4>
          {[p.email, p.phone, p.location, ...links].filter(Boolean).map((c, i) => (
            <p key={i}>{c}</p>
          ))}
        </div>
        {skills.length > 0 && (
          <div className="block">
            <h4>{tr(data, "Keahlian")}</h4>
            <div className="chips">
              {skills.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        )}
        {langs.length > 0 && (
          <div className="block">
            <h4>{tr(data, "Bahasa")}</h4>
            {langs.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        )}
        {data.certifications.length > 0 && (
          <div className="block">
            <h4>{tr(data, "Sertifikasi")}</h4>
            {data.certifications.map((c) => (
              <p key={c.id}>
                {c.name}
                {c.year && <span className="muted"> · {c.year}</span>}
              </p>
            ))}
          </div>
        )}
      </aside>

      <main>
        <header>
          <h1>{p.fullName || tr(data, "Nama Lengkap")}</h1>
          {p.headline && <p className="headline">{p.headline}</p>}
        </header>
        {p.summary && <p className="summary">{p.summary}</p>}

        {data.experience.length > 0 && (
          <section>
            <h2>{tr(data, "Pengalaman")}</h2>
            {data.experience.map((e) => (
              <div key={e.id} className="item">
                <span className="date">{dateRange(e.start, e.end)}</span>
                <h3>{e.role}</h3>
                <p className="at">{[e.company, e.location].filter(Boolean).join(" — ")}</p>
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
                <span className="date">{dateRange(e.start, e.end)}</span>
                <h3>{e.degree}</h3>
                <p className="at">{[e.school, e.notes].filter(Boolean).join(" — ")}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </article>
  );
}
