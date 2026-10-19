import { NextResponse, type NextRequest } from "next/server";
import { parseCvText } from "@/lib/cv-import";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 5 * 1024 * 1024;

/** POST multipart "file" (PDF / DOCX / TXT) → CvData hasil baca otomatis. Tidak menyimpan file apa pun. */
export async function POST(req: NextRequest) {
  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    file = f instanceof File ? f : null;
  } catch {
    return NextResponse.json({ error: "Upload tidak terbaca. Coba lagi." }, { status: 400 });
  }
  if (!file || !file.size) return NextResponse.json({ error: "Pilih file CV dulu." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File terlalu besar (maksimal 5 MB)." }, { status: 413 });

  const name = file.name.toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());
  let text = "";
  try {
    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      const { getDocumentProxy, extractText } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      const out = await extractText(pdf, { mergePages: false });
      text = (out.text as string[]).slice(0, 6).join("\n\n");
    } else if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      text = (await mammoth.extractRawText({ buffer: buf })).value;
    } else if (name.endsWith(".txt") || file.type.startsWith("text/")) {
      text = buf.toString("utf8");
    } else if (name.endsWith(".doc")) {
      return NextResponse.json({ error: "Format .doc lama belum didukung. Simpan ulang sebagai .docx atau PDF, lalu upload lagi." }, { status: 415 });
    } else {
      return NextResponse.json({ error: "Format belum didukung. Upload PDF, DOCX, atau TXT." }, { status: 415 });
    }
  } catch (e) {
    console.error("[cv-import]", e);
    return NextResponse.json({ error: "File tidak bisa dibaca. Pastikan bukan file rusak atau terkunci password." }, { status: 422 });
  }

  if (text.replace(/\s/g, "").length < 40) {
    return NextResponse.json(
      { error: "Tidak ada teks di file ini — kemungkinan hasil scan/foto. Upload PDF/DOCX asli (bukan scan), atau isi manual." },
      { status: 422 },
    );
  }
  return NextResponse.json(parseCvText(text));
}
