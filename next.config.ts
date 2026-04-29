import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local SVG cover assets live under /public/covers — bypass the
    // image optimizer for them. We only ever serve our own SVGs.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
