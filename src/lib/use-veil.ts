"use client";
import { useEffect, useState } from "react";

/**
 * true saat halaman tidak aktif: pindah tab/app, jendela kehilangan fokus
 * (mis. Snipping Tool / Win+Shift+S / Cmd+Shift+4 di sebagian sistem), atau
 * masuk app switcher di HP. Dipakai untuk mem-blur preview non-Pro.
 */
export function useVeil(enabled: boolean) {
  const [veiled, setVeiled] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const on = () => setVeiled(true);
    const off = () => setVeiled(document.visibilityState === "hidden");
    const vis = () => setVeiled(document.visibilityState === "hidden" || !document.hasFocus());
    window.addEventListener("blur", on);
    window.addEventListener("focus", off);
    window.addEventListener("pagehide", on);
    document.addEventListener("visibilitychange", vis);
    // tombol PrintScreen di Windows: tutup sesaat
    const key = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || (e.metaKey && e.shiftKey && ["3", "4", "5", "#", "$", "%"].includes(e.key))) {
        setVeiled(true);
        setTimeout(() => setVeiled(!document.hasFocus()), 1500);
      }
    };
    window.addEventListener("keydown", key);
    window.addEventListener("keyup", key);
    return () => {
      window.removeEventListener("blur", on);
      window.removeEventListener("focus", off);
      window.removeEventListener("pagehide", on);
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", key);
    };
  }, [enabled]);
  return enabled && veiled;
}
