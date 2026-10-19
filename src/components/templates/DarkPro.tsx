import { splitList, type CvData } from "@/lib/cv";
import { Bullets, dateRange } from "./parts";

/** Dark Pro — sidebar gelap dengan aksen hijau limau, kesan tech & modern. */
export default function DarkPro({ data }: { data: CvData }) {
  const { personal: p } = data;
  const skills = splitList(data.skills);
  const langs = splitList(data.languages);
  return (
    <article className="tpl-dark">
      <aside>
        <h1>{(p.fullName || "Nama Lengkap").split(" ").map((w, i) => <span key={i}>{w}</span>)}</h1>
        {p.headline && <p className="headline">{p.headline}</p>}
        <div className="block"><h4>// kontak</h4>{[p.email, p.phone, p.location, ...splitList(p.links)].filter(Boolean).map((c, i) => <p key={i}>{c}</p>)}</div>
        {skills.length > 0 && (<div className="block"><h4>// keahlian</h4>{skills.map((s) => <p key={s} className="skill">{s}</p>)}</div>)}
        {langs.length > 0 && (<div className="block"><h4>// bahasa</h4>{langs.map((l) => <p key={l}>{l}</p>)}</div>)}
      </aside>
      <main>
        {p.summary && (<section><h2>Profil</h2><p>{p.summary}</p></section>)}
        {data.experience.length > 0 && (
          <section>
            <h2>Pengalaman</h2>
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
            <h2>Pendidikan</h2>
            {data.education.map((e) => (
              <div key={e.id} className="item">
                <div className="row"><h3>{e.degree}</h3><span className="date">{dateRange(e.start, e.end)}</span></div>
                <p className="at">{[e.school, e.notes].filter(Boolean).join(" · ")}</p>
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
