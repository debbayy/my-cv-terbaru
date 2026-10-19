import type { CardData } from "@/lib/card";

/* Kartu tambahan — kanvas 540x675. Semua ilustrasi SVG buatan sendiri. */

const Lines = ({ text }: { text: string }) => (
  <>{text.split("\n").map((l, i) => <span key={i} className="block">{l || " "}</span>)}</>
);
const Body = ({ data, order = "to-first", sub }: { data: CardData; order?: "to-first" | "title-first"; sub?: string }) => (
  <div className="inner">
    {order === "to-first" && <p className="to">{data.to}</p>}
    <h1>{data.headline}</h1>
    {order === "title-first" && <p className="to">{data.to}</p>}
    {sub && <p className="sub">{sub}</p>}
    <p className="msg"><Lines text={data.message} /></p>
    <p className="from">{data.from}</p>
  </div>
);
const star = (x: number, y: number, r: number) =>
  `M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3}Z`;

/* Ulang tahun — Balon */
export function BirthdayBalloons({ data }: { data: CardData }) {
  const b = [[90, 150, "#ff6b6b"], [150, 110, "#ffd93d"], [395, 120, "#6bcBef"], [455, 165, "#c77dff"], [60, 250, "#4ecdc4"], [480, 270, "#ff9f43"]] as const;
  return (
    <div className="card-canvas c-balloons">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        {b.map(([x, y, c], i) => (
          <g key={i}>
            <path d={`M${x} ${y + 44} q${i % 2 ? 10 : -10} 40 0 80 q${i % 2 ? -10 : 10} 40 0 70`} stroke="#9aa5b1" strokeWidth="1.5" fill="none" />
            <ellipse cx={x} cy={y} rx="34" ry="42" fill={c} />
            <ellipse cx={x - 11} cy={y - 14} rx="7" ry="11" fill="#fff" opacity=".45" />
            <path d={`M${x - 5} ${y + 42} L${x + 5} ${y + 42} L${x} ${y + 49}Z`} fill={c} />
          </g>
        ))}
        {[[270, 40], [40, 470], [500, 470], [300, 620]].map(([x, y], i) => <path key={i} d={star(x, y, 8)} fill="#ffd93d" />)}
      </svg>
      <Body data={data} />
    </div>
  );
}

/* Ulang tahun — Neon Party */
export function BirthdayNeon({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-neon">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <rect x="30" y="30" width="480" height="615" rx="28" fill="none" stroke="#ff2e93" strokeWidth="3" />
        <rect x="42" y="42" width="456" height="591" rx="22" fill="none" stroke="#00e5ff" strokeWidth="1.5" opacity=".7" />
        {[[95, 110], [445, 120], [80, 560], [460, 570], [270, 90]].map(([x, y], i) => <path key={i} d={star(x, y, 10)} fill={i % 2 ? "#00e5ff" : "#ffe600"} />)}
      </svg>
      <Body data={data} order="title-first" />
    </div>
  );
}

/* Lebaran — Masjid Senja */
export function LebaranMosque({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-mosque">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1b4d" /><stop offset=".6" stopColor="#6b3d7a" /><stop offset="1" stopColor="#e48f6b" /></linearGradient></defs>
        <rect width="540" height="675" fill="url(#dusk)" />
        <path d="M410 70 a42 42 0 1 0 30 72 a34 34 0 1 1 -30 -72Z" fill="#f6d78b" />
        {[[80, 60], [160, 120], [300, 40], [500, 220], [60, 210]].map(([x, y], i) => <path key={i} d={star(x, y, 5)} fill="#f6d78b" />)}
        <g fill="#1c1233">
          <rect x="0" y="560" width="540" height="115" />
          <rect x="70" y="420" width="18" height="140" /><path d="M70 420 L79 395 L88 420Z" />
          <rect x="452" y="420" width="18" height="140" /><path d="M452 420 L461 395 L470 420Z" />
          <path d="M150 560 L150 500 Q270 380 390 500 L390 560Z" />
          <rect x="120" y="500" width="300" height="60" />
          <path d="M262 395 L270 370 L278 395Z" />
        </g>
        <g fill="#f6d78b" opacity=".9">{[175, 225, 315, 365].map((x) => <path key={x} d={`M${x} 545 L${x} 520 Q${x + 9} 508 ${x + 18} 520 L${x + 18} 545Z`} />)}</g>
      </svg>
      <Body data={data} sub="Minal Aidin Wal Faizin" />
    </div>
  );
}

/* Ramadan — Lentera */
const Lantern = ({ x, y, s, c }: { x: number; y: number; s: number; c: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1="0" y1="-80" x2="0" y2="-28" stroke="#d4af37" strokeWidth="2" />
    <path d="M-14 -28 L14 -28 L10 -20 L-10 -20Z" fill="#d4af37" />
    <path d="M-20 -20 L20 -20 L26 20 L0 44 L-26 20Z" fill={c} stroke="#d4af37" strokeWidth="2.5" />
    <path d="M0 -20 L0 44 M-20 -20 L-12 30 M20 -20 L12 30" stroke="#d4af37" strokeWidth="1.5" />
    <circle cy="8" r="8" fill="#ffe08a" opacity=".9" />
  </g>
);
export function RamadanLantern({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-ramadan">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <Lantern x={90} y={110} s={1.1} c="#7b2d26" /><Lantern x={180} y={80} s={0.75} c="#1f5f5b" />
        <Lantern x={450} y={120} s={1} c="#1f5f5b" /><Lantern x={370} y={80} s={0.7} c="#7b2d26" />
        <path d="M0 640 L540 640" stroke="#d4af37" strokeWidth="1.5" />
        {Array.from({ length: 27 }, (_, i) => <path key={i} d={star(10 + i * 20, 655, 4)} fill="#d4af37" />)}
      </svg>
      <Body data={data} />
    </div>
  );
}

/* Idul Adha — Geometris */
export function IdulAdhaGeo({ data }: { data: CardData }) {
  const tiles = [];
  for (let y = 0; y < 7; y++) for (let x = 0; x < 6; x++) tiles.push([x * 100 - (y % 2) * 50, y * 100]);
  return (
    <div className="card-canvas c-adha">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <g fill="none" stroke="#c9a86a" strokeWidth="1" opacity=".35">
          {tiles.map(([x, y], i) => <path key={i} d={`M${x + 50} ${y} L${x + 100} ${y + 50} L${x + 50} ${y + 100} L${x} ${y + 50}Z M${x + 50} ${y + 20} L${x + 80} ${y + 50} L${x + 50} ${y + 80} L${x + 20} ${y + 50}Z`} />)}
        </g>
        <rect x="60" y="150" width="420" height="380" rx="210" fill="#0e3b43" stroke="#c9a86a" strokeWidth="3" />
        <path d="M300 185 a26 26 0 1 0 18 46 a21 21 0 1 1 -18 -46Z" fill="#c9a86a" />
      </svg>
      <Body data={data} />
    </div>
  );
}

/* Pernikahan — Monogram Minimal */
export function WeddingMonogram({ data }: { data: CardData }) {
  const initials = (data.to.replace(/^untuk\s+/i, "").match(/\b\p{L}/gu) ?? ["A", "B"]).filter((c) => c !== "&").slice(0, 2).join(" & ");
  return (
    <div className="card-canvas c-mono">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <rect x="36" y="36" width="468" height="603" fill="none" stroke="#b8975a" strokeWidth="1" />
        <circle cx="270" cy="150" r="54" fill="none" stroke="#b8975a" strokeWidth="1.5" />
      </svg>
      <p className="monogram">{initials}</p>
      <Body data={data} />
    </div>
  );
}

/* Anniversary — Hati */
export function AnniversaryHearts({ data }: { data: CardData }) {
  const heart = (x: number, y: number, s: number, c: string, o = 1) => (
    <path key={`${x}${y}`} transform={`translate(${x} ${y}) scale(${s})`} opacity={o} d="M0 6 C0 -2 10 -4 12 4 C14 -4 24 -2 24 6 C24 14 12 22 12 22 C12 22 0 14 0 6Z" fill={c} />
  );
  return (
    <div className="card-canvas c-anniv">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        {heart(210, 70, 5, "#ffffff", 0.12)}
        {heart(60, 520, 2.2, "#ffb3c1", 0.6)}{heart(430, 80, 1.6, "#ffb3c1", 0.6)}{heart(450, 540, 2.8, "#ffffff", 0.15)}
        {heart(40, 120, 1, "#ffccd5")}{heart(490, 330, 1, "#ffccd5")}
      </svg>
      <Body data={data} order="title-first" />
    </div>
  );
}

/* Kelahiran bayi — Bulan & Bintang */
export function BabyMoon({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-baby">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <path d="M250 70 a62 62 0 1 0 44 104 a50 50 0 1 1 -44 -104Z" fill="#ffe8a3" />
        <circle cx="300" cy="140" r="3" fill="#7a8fa6" /><path d="M292 158 q8 7 16 0" stroke="#7a8fa6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {[[100, 90, 9], [420, 70, 7], [460, 200, 10], [70, 230, 6], [380, 160, 5], [150, 180, 5]].map(([x, y, r], i) => <path key={i} d={star(x, y, r)} fill="#ffe8a3" />)}
        <path d="M0 610 Q90 570 180 610 T360 610 T540 610 L540 675 L0 675Z" fill="#ffffff" opacity=".7" />
      </svg>
      <Body data={data} sub="Welcome to the world" />
    </div>
  );
}

/* Lekas sembuh — Bunga Matahari */
const Sunflower = ({ x, y, s }: { x: number; y: number; s: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 30 L0 140" stroke="#6a994e" strokeWidth="5" />
    <path d="M0 90 C-30 70 -45 90 -40 100 C-30 105 -10 100 0 90Z" fill="#6a994e" />
    {Array.from({ length: 14 }, (_, i) => <ellipse key={i} rx="9" ry="26" fill="#ffc300" transform={`rotate(${i * (360 / 14)}) translate(0 -30)`} />)}
    <circle r="22" fill="#7f4f24" />
  </g>
);
export function GetWellSunflower({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-sun">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <circle cx="470" cy="70" r="120" fill="#fff1b8" />
        <Sunflower x={90} y={530} s={1.1} /><Sunflower x={450} y={545} s={0.85} /><Sunflower x={170} y={590} s={0.6} />
      </svg>
      <Body data={data} order="title-first" />
    </div>
  );
}

/* Duka cita — Lily */
export function CondolenceLily({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-lily">
      <svg className="lily" viewBox="0 0 120 160" aria-hidden>
        <path d="M60 150 C58 110 62 80 60 60" stroke="#7d8b7a" strokeWidth="2.5" fill="none" />
        <path d="M60 120 C40 110 30 118 28 126 C40 128 52 124 60 120Z" fill="#9aa894" />
        {[-50, -10, 30].map((r) => <path key={r} transform={`translate(60 60) rotate(${r})`} d="M0 0 C-10 -18 -6 -40 0 -50 C6 -40 10 -18 0 0Z" fill="#ffffff" stroke="#c8c8c8" strokeWidth="1" />)}
        <circle cx="60" cy="58" r="3" fill="#d9c27a" />
      </svg>
      <Body data={data} />
    </div>
  );
}

/* Imlek — Lampion & Emas */
export function ImlekLampion({ data }: { data: CardData }) {
  const L = ({ x, y, s }: { x: number; y: number; s: number }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1="0" y1="-70" x2="0" y2="-34" stroke="#f2c14e" strokeWidth="2" />
      <rect x="-14" y="-36" width="28" height="8" rx="2" fill="#f2c14e" />
      <ellipse rx="40" ry="32" fill="#e63946" />
      <path d="M-20 -30 Q-30 0 -20 30 M0 -32 L0 32 M20 -30 Q30 0 20 30" stroke="#b5179e22" strokeWidth="0" />
      <path d="M-20 -29 Q-32 0 -20 29 M20 -29 Q32 0 20 29 M0 -32 L0 32" stroke="#a4161a" strokeWidth="2" fill="none" />
      <rect x="-14" y="28" width="28" height="8" rx="2" fill="#f2c14e" />
      <path d="M-6 36 L-8 62 M0 36 L0 66 M6 36 L8 62" stroke="#f2c14e" strokeWidth="2" />
    </g>
  );
  return (
    <div className="card-canvas c-imlek">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <g fill="none" stroke="#f2c14e" strokeWidth="1" opacity=".25">
          {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={(i % 4) * 160 + 30} cy={Math.floor(i / 4) * 560 + 60} r="70" />)}
        </g>
        <L x={95} y={130} s={1} /><L x={445} y={120} s={1.15} /><L x={175} y={95} s={0.6} />
      </svg>
      <Body data={data} sub="Gong Xi Fa Cai" />
    </div>
  );
}

/* Hari Ibu — Floral Pink */
export function MothersDayFloral({ data }: { data: CardData }) {
  const flower = (x: number, y: number, s: number, c: string) => (
    <g key={`${x}${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: 6 }, (_, i) => <ellipse key={i} rx="12" ry="22" fill={c} transform={`rotate(${i * 60}) translate(0 -18)`} />)}
      <circle r="10" fill="#ffd166" />
    </g>
  );
  return (
    <div className="card-canvas c-mom">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        {flower(60, 70, 1.4, "#ff8fab")}{flower(140, 40, 0.8, "#ffc2d1")}{flower(30, 170, 0.7, "#ffb3c6")}
        {flower(480, 610, 1.5, "#ff8fab")}{flower(400, 640, 0.8, "#ffc2d1")}{flower(510, 500, 0.7, "#ffb3c6")}
        <path d="M100 100 C160 160 120 220 60 260" stroke="#8fbc8f" strokeWidth="3" fill="none" />
        <path d="M440 575 C380 515 420 455 480 415" stroke="#8fbc8f" strokeWidth="3" fill="none" />
      </svg>
      <Body data={data} order="title-first" />
    </div>
  );
}

/* Selamat / promosi / kerja baru — Starburst */
export function CongratsBurst({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-congrats">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <g transform="translate(270 300)">
          {Array.from({ length: 24 }, (_, i) => (
            <path key={i} d="M0 0 L-22 -480 L22 -480Z" fill={i % 2 ? "#ffe066" : "#fff3b0"} transform={`rotate(${i * 15})`} />
          ))}
        </g>
        <circle cx="270" cy="300" r="185" fill="#ffffff" />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={(i * 113) % 540} y={(i * 89) % 675} width="8" height="16" rx="2" fill={["#ef476f", "#118ab2", "#06d6a0"][i % 3]} transform={`rotate(${i * 40} ${(i * 113) % 540} ${(i * 89) % 675})`} />
        ))}
      </svg>
      <Body data={data} />
    </div>
  );
}

/* Natal — Ornamen Gantung */
export function ChristmasOrnaments({ data }: { data: CardData }) {
  const o = [[110, 120, "#c1121f"], [210, 170, "#2a9d8f"], [330, 140, "#e9c46a"], [430, 190, "#c1121f"]] as const;
  return (
    <div className="card-canvas c-orn">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        {o.map(([x, y, c], i) => (
          <g key={i}>
            <line x1={x} y1="0" x2={x} y2={y - 30} stroke="#9c6644" strokeWidth="1.5" />
            <rect x={x - 8} y={y - 32} width="16" height="10" rx="2" fill="#bfa36a" />
            <circle cx={x} cy={y} r="26" fill={c} />
            <path d={`M${x - 26} ${y} Q${x} ${y + 10} ${x + 26} ${y}`} stroke="#fff" strokeWidth="2" fill="none" opacity=".6" />
            <circle cx={x - 9} cy={y - 9} r="5" fill="#fff" opacity=".5" />
          </g>
        ))}
        <path d="M0 640 C120 610 200 650 300 625 S480 630 540 615 L540 675 L0 675Z" fill="#2a9d8f" opacity=".15" />
      </svg>
      <Body data={data} />
    </div>
  );
}

/* Wisuda — Pastel Diploma */
export function GraduationPastel({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-gradp">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <circle cx="70" cy="70" r="110" fill="#cde7f0" /><circle cx="490" cy="620" r="130" fill="#ffe1e8" />
        <g transform="translate(205 70) rotate(-12)">
          <rect width="130" height="34" rx="17" fill="#fffdf6" stroke="#d6c7a1" strokeWidth="2" />
          <rect x="56" y="-4" width="18" height="42" fill="#e76f51" />
          <path d="M60 38 L58 58 L65 52 L72 58 L70 38Z" fill="#e76f51" />
        </g>
      </svg>
      <Body data={data} order="title-first" />
    </div>
  );
}
