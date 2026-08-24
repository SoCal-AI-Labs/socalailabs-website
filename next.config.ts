import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // socalailabs.ai (and www) permanently redirect to the canonical .com
      {
        source: "/:path*",
        has: [{ type: "host", value: "socalailabs.ai" }],
        destination: "https://www.socalailabs.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.socalailabs.ai" }],
        destination: "https://www.socalailabs.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
