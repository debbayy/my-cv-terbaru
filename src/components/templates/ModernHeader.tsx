import { splitList, type CvData } from "@/lib/cv";
import { tr } from "@/lib/cv-labels";
import { Bullets, contactItems, dateRange } from "./parts";

/** Modern Header — header blok berwarna penuh + 2 kolom. Menarik untuk kirim langsung ke HR. */
export default function ModernHeader({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);

  return (
    <article className="tpl-mheader">
      <header className={p.photo ? "has-photo" : ""}>
        {p.photo && <img className="photo" src={p.photo} alt="" />}
        <h1>{p.fullName || tr(data, "Nama Lengkap")}</h1>
        {p.headline && <p className="headline">{p.headline}</p>}
        <p className="contact">{contactItems(p).join("   /   ")}</p>
      </header>

      <div className="cols">
        <main>
          {p.summary && (
            <section>
              <h2>{tr(data, "Profil")}</h2>
              <p>{p.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section>
              <h2>{tr(data, "Pengalaman")}</h2>
              {data.experience.map((e) => (
                <div key={e.id} className="item">
                  <h3>{e.role}</h3>
                  <p className="at">
                    {[e.company, e.location].filter(Boolean).join(" · ")}
                    <span className="date">{dateRange(e.start, e.end)}</span>
                  </p>
                  <Bullets text={e.bullets} />
                </div>
              ))}
            </section>
          )}
        </main>

        <aside>
          {skills.length > 0 && (
            <section>
              <h2>{tr(data, "Keahlian")}</h2>
              <div className="chips">{skills.map((s) => <span key={s}>{s}</span>)}</div>
            </section>
          )}
          {data.education.length > 0 && (
            <section>
              <h2>{tr(data, "Pendidikan")}</h2>
              {data.education.map((e) => (
                <div key={e.id} className="item">
                  <h3>{e.degree}</h3>
                  <p>{e.school}</p>
                  <p className="date">{dateRange(e.start, e.end)}{e.notes && ` · ${e.notes}`}</p>
                </div>
              ))}
            </section>
          )}
          {data.certifications.length > 0 && (
            <section>
              <h2>{tr(data, "Sertifikasi")}</h2>
              {data.certifications.map((c) => (
                <div key={c.id} className="item">
                  <p><strong>{c.name}</strong></p>
                  <p className="date">{[c.issuer, c.year].filter(Boolean).join(" · ")}</p>
                </div>
              ))}
            </section>
          )}
          {langs.length > 0 && (
            <section>
              <h2>{tr(data, "Bahasa")}</h2>
              {langs.map((l) => <p key={l}>{l}</p>)}
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
