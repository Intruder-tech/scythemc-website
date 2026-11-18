import type { NextConfig } from "next";

/** Static files in /public that change rarely: cache at the CDN edge and in browsers. */
const CACHEABLE = ["/logo.webp", "/screenshots/:path*", "/skins/:path*"];
const ONE_DAY = 60 * 60 * 24;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,

  images: {
    // Serve AVIF where supported, WebP otherwise: the 4–6 MB screenshot PNGs shrink to a few hundred KB.
    formats: ["image/avif", "image/webp"],
    // Keep optimized images cached for 30 days instead of the 4-hour default.
    minimumCacheTTL: ONE_DAY * 30,
  },

  async headers() {
    return CACHEABLE.map((source) => ({
      source,
      headers: [
        {
          key: "Cache-Control",
          // 1 day fresh, then served stale for a week while revalidating, so a replaced
          // screenshot or skin still shows up without a hard refresh.
          value: `public, max-age=${ONE_DAY}, s-maxage=${ONE_DAY * 7}, stale-while-revalidate=${ONE_DAY * 7}`,
        },
      ],
    }));
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
