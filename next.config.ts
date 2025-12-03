import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'beta.riyan.com.mv',
      },
      {
        protocol: 'https',
        hostname: 'beta.riyan.com.mv',
      },
      {
        protocol: 'https',
        hostname: 'res.hals.io',
      },
    ],
  },
};

export default nextConfig;
