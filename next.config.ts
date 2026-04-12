import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["motion", "recharts"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "substackcdn.com" },
      { protocol: "https", hostname: "*.notion.so" },
      { protocol: "https", hostname: "www.notion.so" },
    ],
  },
};

export default config;
