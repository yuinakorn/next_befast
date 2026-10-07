import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Umami runs beside the app (see docker-compose.yml); proxying it keeps
  // the tracker first-party, so it needs no extra domain. Only the tracker
  // script and its collect endpoint are exposed, never the dashboard or API.
  async rewrites() {
    const umami = process.env.UMAMI_URL ?? "http://umami:3000";
    return [
      { source: "/stats/script.js", destination: `${umami}/script.js` },
      { source: "/stats/api/send", destination: `${umami}/api/send` },
    ];
  },
};

export default nextConfig;
