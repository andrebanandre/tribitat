import type { NextConfig } from "next";

const nextConfig = {
  // Allow more time for slow external data sources during SSG
  staticPageGenerationTimeout: 180,
  images: {
    remotePatterns: [
      {
        protocol: process.env.WORDPRESS_PROTOCOL || "https",
        hostname: process.env.WORDPRESS_HOSTNAME || "",
        port: process.env.WORDPRESS_PORT || "",
        pathname: process.env.WORDPRESS_PATHNAME || "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9999",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9999",
        pathname: "/wp-content/uploads/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
