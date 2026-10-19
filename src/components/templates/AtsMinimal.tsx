import { splitList, type CvData } from "@/lib/cv";
import { tr } from "@/lib/cv-labels";
import { Bullets, contactItems, dateRange } from "./parts";

/** ATS Minimalis — padat & bersih, cocok untuk CV 1 halaman yang isinya banyak. */
export default function AtsMinimal({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);

  return (
    <article className="tpl-minimal">
      <header>
        <h1>{p.fullName || tr(data, "Nama Lengkap")}</h1>
        <p className="meta">
          {[p.headline, ...contactItems(p)].filter(Boolean).join(" · ")}
        </p>
      </header>

      {p.summary && (
        <section>
          <h2>{tr(data, "Ringkasan")}</h2>
          <div className="body"><p>{p.summary}</p></div>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h2>{tr(data, "Pengalaman")}</h2>
          <div className="body">
            {data.experience.map((e) => (
              <div key={e.id} className="item">
                <div className="row">
                  <p><strong>{e.role}</strong>{e.company && <>, {e.company}</>}{e.location && <span className="muted"> — {e.location}</span>}</p>
                  <span className="muted">{dateRange(e.start, e.end)}</span>
                </div>
                <Bullets text={e.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <h2>{tr(data, "Pendidikan")}</h2>
          <div className="body">
            {data.education.map((e) => (
              <div key={e.id} className="item">
                <div className="row">
                  <p><strong>{e.degree}</strong>{e.school && <>, {e.school}</>}{e.notes && <span className="muted"> — {e.notes}</span>}</p>
                  <span className="muted">{dateRange(e.start, e.end)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2>{tr(data, "Keahlian")}</h2>
          <div className="body"><p>{skills.join(", ")}</p></div>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section>
          <h2>{tr(data, "Sertifikasi")}</h2>
          <div className="body">
            {data.certifications.map((c) => (
              <p key={c.id}>{c.name}{c.issuer && `, ${c.issuer}`}{c.year && ` (${c.year})`}</p>
            ))}
          </div>
        </section>
      )}

      {langs.length > 0 && (
        <section>
          <h2>{tr(data, "Bahasa")}</h2>
          <div className="body"><p>{langs.join(", ")}</p></div>
        </section>
      )}
    </article>
  );
}
