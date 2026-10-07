import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Umami runs beside the app (see docker-compose.yml); proxying it keeps
  // the tracker first-party, so it needs no extra domain.
  async rewrites() {
    return [{ source: "/stats/:path*", destination: `${process.env.UMAMI_URL ?? "http://umami:3000"}/:path*` }];
  },
};

export default nextConfig;
