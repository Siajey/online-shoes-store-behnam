import type { NextConfig } from "next";

/** آدرس CDN تصاویر؛ فقط همین میزبان برای next/image مجاز می‌شود. */
const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
const mediaUrl = mediaBase ? new URL(mediaBase) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: mediaUrl
      ? [
          {
            protocol: mediaUrl.protocol === "http:" ? "http" : "https",
            hostname: mediaUrl.hostname,
            port: mediaUrl.port,
            pathname: "/**",
          },
        ]
      : [],
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
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
