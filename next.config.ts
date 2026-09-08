import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  poweredByHeader: false,
  devIndicators: false,
  async rewrites() {
    const cms = process.env.CMS_URL;
    return cms ? [{ source: "/storage/:path*", destination: `${cms.replace(/\/$/, "")}/storage/:path*` }] : [];
  },
};

export default config;
