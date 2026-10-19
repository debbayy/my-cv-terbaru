import { splitList, type CvData } from "@/lib/cv";
import { Bullets, dateRange } from "./parts";

/** Pastel Soft — kolom kiri pastel membulat, nuansa lembut & ramah. */
export default function PastelSoft({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);
  const initials = (p.fullName || "NL").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <article className="tpl-pastel">
      <aside>
        <div className="avatar">{initials}</div>
        <h1>{p.fullName || "Nama Lengkap"}</h1>
        {p.headline && <p className="headline">{p.headline}</p>}
        <div className="block">
          <h4>Kontak</h4>
          {[p.email, p.phone, p.location, ...splitList(p.links)].filter(Boolean).map((c, i) => <p key={i}>{c}</p>)}
        </div>
        {skills.length > 0 && (<div className="block"><h4>Keahlian</h4><div className="chips">{skills.map((s) => <span key={s}>{s}</span>)}</div></div>)}
        {langs.length > 0 && (<div className="block"><h4>Bahasa</h4>{langs.map((l) => <p key={l}>{l}</p>)}</div>)}
      </aside>
      <main>
        {p.summary && (<section><h2>Tentang Saya</h2><p>{p.summary}</p></section>)}
        {data.experience.length > 0 && (
          <section>
            <h2>Pengalaman</h2>
            {data.experience.map((e) => (
              <div key={e.id} className="item">
                <h3>{e.role}</h3>
                <p className="at">{[e.company, e.location].filter(Boolean).join(" · ")} <span className="date">{dateRange(e.start, e.end)}</span></p>
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
                <h3>{e.degree}</h3>
                <p className="at">{[e.school, e.notes].filter(Boolean).join(" · ")} <span className="date">{dateRange(e.start, e.end)}</span></p>
              </div>
            ))}
          </section>
        )}
        {data.certifications.length > 0 && (
          <section><h2>Sertifikasi</h2>
            {data.certifications.map((c) => <p key={c.id}>{c.name}{c.issuer && ` · ${c.issuer}`}{c.year && ` (${c.year})`}</p>)}
          </section>
        )}
      </main>
    </article>
  );
}
