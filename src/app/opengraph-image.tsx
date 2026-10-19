import { ImageResponse } from "next/og";

export const alt = "CVku — Bikin CV ATS & kartu ucapan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Gambar preview saat link dibagikan ke WhatsApp / Facebook / X. */
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f3ee", padding: 70, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, color: "#1c1b19" }}>
            CV<span style={{ color: "#2f5d50" }}>ku</span>
          </div>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05, color: "#1c1b19", marginTop: 24 }}>
            CV yang lolos ATS, selesai dalam 10 menit.
          </div>
          <div style={{ fontSize: 30, color: "#6b665d", marginTop: 24 }}>Template gratis · Kartu ucapan · PDF & PNG</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: 330, marginLeft: 50, background: "#fff", borderRadius: 18, padding: 34, boxShadow: "0 20px 50px rgba(0,0,0,.12)", transform: "rotate(2deg)" }}>
          <div style={{ display: "flex", borderLeft: "8px solid #2f5d50", paddingLeft: 16, flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 800 }}>Rina Pratiwi</div>
            <div style={{ fontSize: 18, color: "#2f5d50", fontWeight: 700 }}>Frontend Developer</div>
          </div>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} style={{ display: "flex", height: 12, background: i % 3 === 0 ? "#e8b44a" : "#e3ddd2", borderRadius: 6, marginTop: 22, width: `${100 - (i % 3) * 18}%` }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
