import type { NextConfig } from "next";

type Pattern = { protocol: "http" | "https"; hostname: string; port: string; pathname: string };

/** آدرس CDN تصاویر (کلیدهای تصویر با آن ساخته می‌شوند). */
const fromUrl = (value: string | undefined): Pattern | null => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return {
      protocol: url.protocol === "http:" ? "http" : "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/**",
    };
  } catch {
    return null;
  }
};

/** میزبان ذخیره‌ی تصاویر بک‌اند (imageUrl کامل در سبد، سفارش و علاقه‌مندی‌ها). */
const BACKEND_IMAGE_HOSTS = ["behnam-sh.s3.ir-central1.arvanstorage.ir"];

/** میزبان‌های اضافه، جداشده با ویرگول: NEXT_PUBLIC_IMAGE_HOSTS=cdn.example.com,img.example.com */
const extraHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const remotePatterns: Pattern[] = [
  fromUrl(process.env.NEXT_PUBLIC_MEDIA_BASE_URL),
  ...[...BACKEND_IMAGE_HOSTS, ...extraHosts].map((hostname): Pattern => ({
    protocol: "https",
    hostname,
    port: "",
    pathname: "/**",
  })),
].filter((p): p is Pattern => p !== null);

const nextConfig: NextConfig = {
  images: { remotePatterns },
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
