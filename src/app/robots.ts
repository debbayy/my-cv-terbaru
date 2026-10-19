import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/dashboard", "/editor/", "/kartu/claim", "/claim", "/bayar", "/print", "/print-card", "/draft"] }],
    sitemap: `${appUrl()}/sitemap.xml`,
  };
}
