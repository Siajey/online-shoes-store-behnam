/** صفحه‌های عمومی که باید در sitemap بیایند. ☐ بعد از آماده شدن API، صفحه‌های محصول هم اضافه شوند. */
export const PUBLIC_PATHS = [
  "/",
  "/products",
  "/size-guide",
  "/returns",
  "/faq",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
] as const;

/** مسیرهای خصوصی یا فنی که نباید ایندکس شوند. */
export const DISALLOWED_PATHS = [
  "/account",
  "/cart",
  "/checkout",
  "/favourites",
  "/login",
  "/dev",
] as const;

const trimEnd = (url: string) => url.replace(/\/+$/, "");

export function absoluteUrl(base: string, path: string): string {
  return path === "/" ? trimEnd(base) : `${trimEnd(base)}${path}`;
}

export function buildSitemap(base: string) {
  return PUBLIC_PATHS.map((path) => ({ url: absoluteUrl(base, path) }));
}

export function buildRobots(base: string) {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [...DISALLOWED_PATHS] }],
    sitemap: absoluteUrl(base, "/sitemap.xml"),
  };
}
