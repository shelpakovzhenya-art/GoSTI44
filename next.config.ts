import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  poweredByHeader: false,
  devIndicators: false,
  async rewrites() {
    const cms = process.env.CMS_URL;
    if (!cms) throw new Error("CMS_URL is required to serve CMS uploads");
    return [{ source: "/storage/:path*", destination: `${cms.replace(/\/$/, "")}/storage/:path*` }];
  },
};

export default config;
