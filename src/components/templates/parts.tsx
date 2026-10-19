import { splitLines, type CvData } from "@/lib/cv";

export const contactItems = (p: CvData["personal"]) =>
  [p.email, p.phone, p.location, ...p.links.split(",").map((s) => s.trim())].filter(Boolean);

export const dateRange = (start: string, end: string) =>
  [start, end].filter(Boolean).join(" – ");

export function Bullets({ text, className }: { text: string; className?: string }) {
  const lines = splitLines(text);
  if (!lines.length) return null;
  return (
    <ul className={className}>
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
}
