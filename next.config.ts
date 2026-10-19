import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chromium & puppeteer jangan dibundle — dipanggil langsung dari node_modules di server
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core", "puppeteer"],
};

export default nextConfig;
