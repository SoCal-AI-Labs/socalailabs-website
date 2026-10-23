import type { NextConfig } from "next";

// Next.js hydration/motion scripts and inline styles need unsafe-inline.
// Fonts and images are self-hosted; Formspree is the only external request.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io",
  "form-action 'self' https://formspree.io",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
      ],
    }];
  },
  // HSTS remains managed by the existing hosting configuration, unchanged.
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
