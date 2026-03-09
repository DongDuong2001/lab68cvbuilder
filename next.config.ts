import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "buildinprocess.com",
      },
      {
        protocol: "https",
        hostname: "unikorn.vn",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
