import { splitList, type CvData } from "@/lib/cv";
import { tr } from "@/lib/cv-labels";
import { Bullets, contactItems, dateRange } from "./parts";

/** Bold Timeline — nama besar, aksen kuning, kolom tanggal di kiri seperti timeline. */
export default function BoldTimeline({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);

  return (
    <article className="tpl-bold">
      <header>
        <h1>
          {(p.fullName || tr(data, "Nama Lengkap")).split(" ").map((w, i) => (
            <span key={i}>{w} </span>
          ))}
        </h1>
        {p.headline && <p className="headline"><mark>{p.headline}</mark></p>}
        <p className="contact">{contactItems(p).join("  ·  ")}</p>
      </header>

      {p.summary && <p className="summary">{p.summary}</p>}

      {data.experience.length > 0 && (
        <section>
          <h2>{tr(data, "Pengalaman")}</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="tl">
              <div className="when">{dateRange(e.start, e.end)}</div>
              <div className="what">
                <h3>{e.role}</h3>
                <p className="at">{[e.company, e.location].filter(Boolean).join(", ")}</p>
                <Bullets text={e.bullets} />
              </div>
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <h2>{tr(data, "Pendidikan")}</h2>
          {data.education.map((e) => (
            <div key={e.id} className="tl">
              <div className="when">{dateRange(e.start, e.end)}</div>
              <div className="what">
                <h3>{e.degree}</h3>
                <p className="at">{[e.school, e.notes].filter(Boolean).join(" — ")}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {(skills.length > 0 || langs.length > 0 || data.certifications.length > 0) && (
        <section>
          <h2>{tr(data, "Lainnya")}</h2>
          {skills.length > 0 && (
            <div className="tl"><div className="when">{tr(data, "Keahlian")}</div><div className="what"><p>{skills.join(" / ")}</p></div></div>
          )}
          {langs.length > 0 && (
            <div className="tl"><div className="when">{tr(data, "Bahasa")}</div><div className="what"><p>{langs.join(" / ")}</p></div></div>
          )}
          {data.certifications.length > 0 && (
            <div className="tl">
              <div className="when">{tr(data, "Sertifikasi")}</div>
              <div className="what">
                {data.certifications.map((c) => (
                  <p key={c.id}>{c.name}{c.issuer && `, ${c.issuer}`}{c.year && ` (${c.year})`}</p>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </article>
  );
}
