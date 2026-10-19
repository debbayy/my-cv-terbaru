import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appUrl();
  const now = new Date();
  return ["", "/kartu", "/pricing", "/syarat", "/privasi", "/refund", "/kontak"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === "" || p === "/kartu" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/kartu" ? 0.9 : 0.5,
  }));
}
