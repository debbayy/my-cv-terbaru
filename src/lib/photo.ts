"use client";
/** Kecilkan & crop foto jadi persegi 360px JPEG (≈20–40 KB) supaya ringan disimpan di data CV. */
export async function photoToDataUrl(file: File, size = 360): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const s = Math.min(img.naturalWidth, img.naturalHeight);
    // crop tengah, sedikit ke atas (wajah biasanya di sepertiga atas)
    const sx = (img.naturalWidth - s) / 2;
    const sy = Math.max(0, (img.naturalHeight - s) / 3);
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    c.getContext("2d")!.drawImage(img, sx, sy, s, s, 0, 0, size, size);
    return c.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}
