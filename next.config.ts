import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chromium & puppeteer jangan dibundle — dipanggil langsung dari node_modules di server
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core", "puppeteer"],
  // File binary Chromium dibaca dinamis saat runtime, jadi Next tidak otomatis menyertakannya ke function Vercel
  outputFileTracingIncludes: {
    "/api/cv/*/pdf": ["./node_modules/@sparticuz/chromium/bin/**"],
    "/api/card/*/export": ["./node_modules/@sparticuz/chromium/bin/**"],
    "/api/health": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
};

export default nextConfig;
