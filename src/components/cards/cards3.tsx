import type { CardData } from "@/lib/card";

const Lines = ({ text }: { text: string }) => (
  <>{text.split("\n").map((l, i) => <span key={i} className="block">{l || " "}</span>)}</>
);
const Body = ({ data, titleFirst = false, sub }: { data: CardData; titleFirst?: boolean; sub?: string }) => (
  <div className="inner">
    {!titleFirst && <p className="to">{data.to}</p>}
    <h1>{data.headline}</h1>
    {titleFirst && <p className="to">{data.to}</p>}
    {sub && <p className="sub">{sub}</p>}
    <p className="msg"><Lines text={data.message} /></p>
    <p className="from">{data.from}</p>
  </div>
);
const star = (x: number, y: number, r: number) =>
  `M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3}Z`;

/* Ramadan — Bulan Minimal */
export function RamadanMoon({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-rmoon">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <path d="M270 70 a80 80 0 1 0 60 132 a64 64 0 1 1 -60 -132Z" fill="#e9c46a" />
        {[[150, 90], [400, 120], [120, 200], [430, 230], [200, 40], [350, 60]].map(([x, y], i) => <path key={i} d={star(x, y, i % 2 ? 6 : 9)} fill="#e9c46a" />)}
        <g stroke="#e9c46a" strokeWidth="1" opacity=".35">{Array.from({ length: 11 }, (_, i) => <line key={i} x1={i * 54} y1="0" x2={i * 54} y2={20 + (i % 3) * 25} />)}</g>
      </svg>
      <Body data={data} />
    </div>
  );
}

/* Idul Adha — Hijau Kubah */
export function AdhaGreen({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-adhag">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <path d="M0 675 L0 520 Q270 430 540 520 L540 675Z" fill="#1b4332" />
        <path d="M200 520 Q270 420 340 520Z" fill="#2d6a4f" />
        <rect x="262" y="400" width="16" height="40" fill="#2d6a4f" /><path d="M270 380 a9 9 0 1 0 6 16 a7 7 0 1 1 -6 -16Z" fill="#f4d58d" />
        {[[80, 80], [460, 100], [60, 300], [480, 330]].map(([x, y], i) => <path key={i} d={star(x, y, 8)} fill="#f4d58d" opacity=".8" />)}
      </svg>
      <Body data={data} />
    </div>
  );
}

/* Anniversary — Polaroid */
export function AnnivPolaroid({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-polaroid">
      <div className="photo">
        <div className="pic">
          <svg viewBox="0 0 100 80" aria-hidden><path d="M50 70 C20 50 10 30 25 18 C35 10 48 18 50 28 C52 18 65 10 75 18 C90 30 80 50 50 70Z" fill="#fff" opacity=".9" /></svg>
        </div>
        <p className="cap">{data.headline}</p>
      </div>
      <div className="inner">
        <p className="to">{data.to}</p>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}

/* Kelahiran — Pink Lembut */
export function BabyPink({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-babyp">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <g transform="translate(270 140)">
          <ellipse cx="0" cy="18" rx="62" ry="40" fill="#fff" />
          <path d="M-62 18 Q-62 -40 0 -40 Q62 -40 62 18Z" fill="#ffc2d1" />
          <circle cx="-30" cy="62" r="12" fill="#ffc2d1" /><circle cx="30" cy="62" r="12" fill="#ffc2d1" />
          <path d="M62 10 L95 -30" stroke="#ffc2d1" strokeWidth="5" strokeLinecap="round" />
        </g>
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 151) % 540} cy={260 + ((i * 97) % 400)} r={3 + (i % 3)} fill={i % 2 ? "#ffd6e0" : "#cdeac0"} />)}
      </svg>
      <Body data={data} sub="Selamat datang, si kecil" />
    </div>
  );
}

/* Terima kasih — Kraft Minimal */
export function ThanksKraft({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-kraft">
      <div className="tag">
        <h1>{data.headline}</h1>
        <p className="to">{data.to}</p>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
      <svg className="twine" viewBox="0 0 540 120" aria-hidden><path d="M0 40 Q270 110 540 30" stroke="#8b5e34" strokeWidth="3" fill="none" strokeDasharray="10 6" /></svg>
    </div>
  );
}

/* Tahun baru — Gold Minimal */
export function NewYearGold({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-nygold">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <rect x="28" y="28" width="484" height="619" fill="none" stroke="#d4af37" strokeWidth="1.5" />
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 97) % 540} cy={(i * 61) % 220} r={1 + (i % 3)} fill="#d4af37" opacity={0.4 + (i % 3) * 0.2} />)}
        <path d="M200 560 L340 560" stroke="#d4af37" strokeWidth="1" />
      </svg>
      <Body data={data} />
    </div>
  );
}

/* Hari Guru — Papan Tulis */
export function TeacherBoard({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-board">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <rect x="24" y="24" width="492" height="560" rx="10" fill="#2f4f3e" stroke="#a0703c" strokeWidth="18" />
        <rect x="160" y="590" width="220" height="14" rx="4" fill="#a0703c" />
        <rect x="190" y="580" width="40" height="10" rx="2" fill="#fff" /><rect x="250" y="582" width="28" height="8" rx="2" fill="#ffd166" />
        <g fill="none" stroke="#ffffff55" strokeWidth="2"><path d="M80 110 l20 -20 l20 20" /><circle cx="440" cy="110" r="16" /><path d="M420 480 h40 M440 460 v40" /></g>
      </svg>
      <div className="inner" style={{ marginBottom: 120 }}>
        <p className="to">{data.to}</p>
        <h1>{data.headline}</h1>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}

/* 17 Agustus — Merah Putih */
export function MerdekaFlag({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-merdeka">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <path d="M0 0 H540 V170 Q400 210 270 170 T0 170Z" fill="#d62828" />
        <path d="M0 675 V560 Q150 520 270 560 T540 560 V675Z" fill="#d62828" />
        <line x1="450" y1="20" x2="450" y2="150" stroke="#f1faee" strokeWidth="4" />
        <path d="M452 24 Q490 16 520 30 V56 Q490 42 452 50Z" fill="#ef233c" stroke="#ffffff" strokeWidth="2" />
        <path d="M452 50 Q490 42 520 56 V82 Q490 68 452 76Z" fill="#ffffff" />
        {[[70, 250], [110, 300], [480, 420]].map(([x, y], i) => <path key={i} d={star(x, y, 9)} fill="#f4a261" />)}
      </svg>
      <Body data={data} sub="Merdeka!" />
    </div>
  );
}
