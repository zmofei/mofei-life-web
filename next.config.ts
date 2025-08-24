import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["@heroicons/react", "motion", "react-photo-view"],
  },
  // Bundle analyzer and optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize chunk splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:lang/blog",
        destination: "/:lang/blog/1",
        permanent: true,
      },
      {
        source: "/:lang/message",
        destination: "/:lang/message/1",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        // {
        //   source: '/api/:path*',
        //   destination: 'https://www.zhuwenlong.com/api/:path*' // Proxy to Backend
        // },
        {
          source: "/api/:path*",
          destination: "https://api.mofei.life/api/:path*", // Proxy to Backend
        },
        {
          source: "/api/finshare/wall/:path*",
          destination: "https://www.finshare.fi/api/finshare/wall/:path*", // Proxy to Backend
        },
      ];
    } else {
      return [];
    }
  },
  images: {
    // Performance optimizations for images
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.zhuwenlong.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.mofei.life",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.mofei.life",
        pathname: "**",
      },
      { protocol: "https", hostname: "mofei.life", pathname: "**" },
      { protocol: "https", hostname: "static.mofei.life", pathname: "**" },
      {
        protocol: "https",
        hostname: "assets-eu.mofei.life",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "assets.mofei.life",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
