/**
 * Download file dari blob URL yang aman di semua browser.
 * Safari/iOS: anchor harus ada di DOM, dan URL jangan langsung di-revoke
 * (kalau di-revoke terlalu cepat, download gagal/kosong).
 */
export function saveBlob(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 4000);
}
