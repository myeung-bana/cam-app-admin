import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.storage.**.nhost.run",
        pathname: "/v1/files/**",
      },
    ],
  },
};

export default nextConfig;
