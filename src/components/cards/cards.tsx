import type { CardData } from "@/lib/card";

/* Semua kartu: kanvas 540x675 px. Dekorasi pakai SVG/CSS buatan sendiri (tanpa aset berlisensi). */

const Lines = ({ text }: { text: string }) => (
  <>{text.split("\n").map((l, i) => <span key={i} className="block">{l || " "}</span>)}</>
);

/* 1. Ulang tahun — Confetti Pop */
export function BirthdayConfetti({ data }: { data: CardData }) {
  const dots = Array.from({ length: 46 }, (_, i) => ({
    x: (i * 137.5) % 100, y: (i * 61.8) % 100, r: 4 + (i % 5) * 2,
    c: ["#ff7aa2", "#ffd166", "#6ec6ff", "#9b8cff", "#5fd3a5"][i % 5], rot: (i * 47) % 180,
  }));
  return (
    <div className="card-canvas c-confetti">
      <svg className="bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {dots.map((d, i) =>
          i % 3 === 0 ? (
            <rect key={i} x={d.x} y={d.y} width={d.r / 6} height={d.r / 2.5} fill={d.c} transform={`rotate(${d.rot} ${d.x} ${d.y})`} />
          ) : (
            <circle key={i} cx={d.x} cy={d.y} r={d.r / 9} fill={d.c} />
          ),
        )}
      </svg>
      <div className="inner">
        <p className="to">{data.to}</p>
        <h1>{data.headline}</h1>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}

/* 2. Ulang tahun — Kue Manis */
export function BirthdayCake({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-cake">
      <svg className="cake" viewBox="0 0 200 170" aria-hidden>
        <rect x="95" y="8" width="10" height="34" rx="4" fill="#ffb3c7" />
        <path d="M100 0 C108 10 106 18 100 20 C94 18 92 10 100 0Z" fill="#ffb648" />
        <rect x="40" y="42" width="120" height="50" rx="10" fill="#fff4e8" stroke="#f2c7a5" strokeWidth="3" />
        <path d="M40 60 q15 14 30 0 t30 0 t30 0 t30 0" fill="none" stroke="#ff8fab" strokeWidth="7" strokeLinecap="round" />
        <rect x="22" y="92" width="156" height="62" rx="12" fill="#ffd6e0" stroke="#f2a7bb" strokeWidth="3" />
        <path d="M22 112 q19.5 16 39 0 t39 0 t39 0 t39 0" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        {[50, 80, 110, 140].map((x) => <circle key={x} cx={x} cy="134" r="5" fill="#ff8fab" />)}
        <rect x="10" y="152" width="180" height="10" rx="5" fill="#e9c9a8" />
      </svg>
      <div className="inner">
        <h1>{data.headline}</h1>
        <p className="to">{data.to}</p>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}

/* 3. Lebaran — Ketupat & Bulan Sabit */
const Ketupat = ({ x, y, s }: { x: number; y: number; s: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1="0" y1="-40" x2="0" y2="-20" stroke="#d9b45b" strokeWidth="2" />
    <path d="M0 -20 L22 2 L0 24 L-22 2Z" fill="#2f7a4b" stroke="#d9b45b" strokeWidth="2" />
    <path d="M-11 -9 L11 13 M11 -9 L-11 13 M0 -20 L0 24 M-22 2 L22 2" stroke="#9fd18b" strokeWidth="1.5" />
    <path d="M-4 24 L-8 40 M4 24 L8 40" stroke="#2f7a4b" strokeWidth="3" strokeLinecap="round" />
  </g>
);
export function LebaranKetupat({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-lebaran">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <circle cx="430" cy="110" r="58" fill="#f3d27a" />
        <circle cx="455" cy="95" r="54" fill="#0f3d2e" />
        {[[60, 40], [120, 90], [300, 50], [500, 260], [40, 300], [480, 600], [90, 620]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 6} L${x + 2} ${y - 2} L${x + 6} ${y} L${x + 2} ${y + 2} L${x} ${y + 6} L${x - 2} ${y + 2} L${x - 6} ${y} L${x - 2} ${y - 2}Z`} fill="#f3d27a" />
        ))}
        <Ketupat x={90} y={140} s={1.3} />
        <Ketupat x={170} y={110} s={0.9} />
        <path d="M0 600 Q270 540 540 600 L540 675 L0 675Z" fill="#0b2f23" />
        <path d="M0 610 Q270 555 540 610" stroke="#d9b45b" strokeWidth="2" fill="none" />
      </svg>
      <div className="inner">
        <p className="to">{data.to}</p>
        <h1>{data.headline}</h1>
        <p className="sub">Mohon Maaf Lahir &amp; Batin</p>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}

/* 4. Pernikahan — Floral */
const Leaf = ({ x, y, r, s = 1 }: { x: number; y: number; r: number; s?: number }) => (
  <path transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} d="M0 0 C10 -18 34 -20 44 0 C34 20 10 18 0 0Z" fill="#9db59a" />
);
export function WeddingFloral({ data }: { data: CardData }) {
  const branch = (flip: boolean) => (
    <g transform={flip ? "translate(540 675) rotate(180)" : undefined}>
      <path d="M-10 160 C80 120 140 60 170 -10" stroke="#7f9a7c" strokeWidth="2.5" fill="none" />
      <Leaf x={40} y={128} r={-40} /><Leaf x={80} y={100} r={-70} s={0.9} /><Leaf x={110} y={70} r={-30} s={0.8} />
      <Leaf x={135} y={40} r={-80} s={0.8} /><Leaf x={20} y={150} r={20} s={0.7} />
      <circle cx="150" cy="22" r="14" fill="#f1c6c0" /><circle cx="150" cy="22" r="6" fill="#e39a92" />
      <circle cx="60" cy="112" r="11" fill="#f6dccf" /><circle cx="60" cy="112" r="4.5" fill="#e9b7a2" />
    </g>
  );
  return (
    <div className="card-canvas c-wedding">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>{branch(false)}{branch(true)}</svg>
      <div className="frame" />
      <div className="inner">
        <p className="to">{data.to}</p>
        <h1>{data.headline}</h1>
        <div className="divider">❦</div>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}

/* 5. Wisuda — Toga */
export function GraduationGold({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-grad">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={(i * 97) % 540} y={(i * 53) % 260} width="6" height="14" fill={i % 2 ? "#e6c068" : "#ffffff55"} transform={`rotate(${i * 33} ${(i * 97) % 540} ${(i * 53) % 260})`} />
        ))}
      </svg>
      <svg className="cap" viewBox="0 0 200 130" aria-hidden>
        <path d="M100 10 L195 45 L100 80 L5 45Z" fill="#e6c068" />
        <path d="M45 60 L45 95 Q100 125 155 95 L155 60 L100 80Z" fill="#c9a24a" />
        <path d="M100 45 L170 58 L170 100" stroke="#fff3cf" strokeWidth="3" fill="none" />
        <circle cx="170" cy="104" r="7" fill="#fff3cf" />
      </svg>
      <div className="inner">
        <h1>{data.headline}</h1>
        <p className="to">{data.to}</p>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}

/* 6. Terima kasih — Cute Hearts */
export function ThanksHearts({ data }: { data: CardData }) {
  const heart = (x: number, y: number, s: number, c: string) => (
    <path key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`} d="M0 6 C0 -2 10 -4 12 4 C14 -4 24 -2 24 6 C24 14 12 22 12 22 C12 22 0 14 0 6Z" fill={c} />
  );
  return (
    <div className="card-canvas c-thanks">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        {heart(40, 50, 2, "#ff9aa2")}{heart(450, 80, 1.4, "#ffb7b2")}{heart(470, 520, 2.4, "#ff9aa2")}
        {heart(60, 560, 1.3, "#ffdac1")}{heart(250, 30, 1, "#ffb7b2")}{heart(30, 330, 1, "#ffb7b2")}{heart(500, 330, 1.1, "#ffdac1")}
      </svg>
      <div className="inner">
        <div className="blob">
          <h1>{data.headline}</h1>
        </div>
        <p className="to">{data.to}</p>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}

/* 7. Natal — Pohon */
export function ChristmasTree({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-xmas">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(i * 131) % 540} cy={(i * 71) % 675} r={1.5 + (i % 3)} fill="#ffffff" opacity=".7" />
        ))}
      </svg>
      <svg className="tree" viewBox="0 0 160 190" aria-hidden>
        <path d="M80 6 L84 16 L95 16 L86 23 L90 34 L80 27 L70 34 L74 23 L65 16 L76 16Z" fill="#ffd166" />
        <path d="M80 30 L120 80 L100 80 L135 125 L110 125 L150 168 L10 168 L50 125 L25 125 L60 80 L40 80Z" fill="#2d6a4f" />
        {[[70, 70, "#e63946"], [95, 100, "#ffd166"], [60, 115, "#ffd166"], [110, 145, "#e63946"], [45, 150, "#e63946"], [85, 135, "#f1faee"]].map(([x, y, c], i) => (
          <circle key={i} cx={x as number} cy={y as number} r="5" fill={c as string} />
        ))}
        <rect x="70" y="168" width="20" height="18" fill="#7f5539" />
      </svg>
      <div className="inner">
        <h1>{data.headline}</h1>
        <p className="to">{data.to}</p>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}

/* 8. Tahun baru — Kembang Api */
const Firework = ({ x, y, r, c }: { x: number; y: number; r: number; c: string }) => (
  <g transform={`translate(${x} ${y})`} stroke={c} strokeWidth="3" strokeLinecap="round">
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={Math.cos(a) * r * 0.35} y1={Math.sin(a) * r * 0.35} x2={Math.cos(a) * r} y2={Math.sin(a) * r} />;
    })}
    <circle r="4" fill={c} stroke="none" />
  </g>
);
export function NewYearFireworks({ data }: { data: CardData }) {
  return (
    <div className="card-canvas c-newyear">
      <svg className="bg" viewBox="0 0 540 675" aria-hidden>
        <Firework x={110} y={120} r={60} c="#ffd166" />
        <Firework x={420} y={90} r={48} c="#ef476f" />
        <Firework x={300} y={190} r={34} c="#06d6a0" />
        <Firework x={460} y={560} r={40} c="#118ab2" />
        <Firework x={70} y={580} r={30} c="#ef476f" />
      </svg>
      <div className="inner">
        <p className="to">{data.to}</p>
        <h1>{data.headline}</h1>
        <p className="msg"><Lines text={data.message} /></p>
        <p className="from">{data.from}</p>
      </div>
    </div>
  );
}
