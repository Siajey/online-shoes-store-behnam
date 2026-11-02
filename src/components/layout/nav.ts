/** آیا لینک با مسیر فعلی یکی است؟ لینک‌های دارای query (فیلتر) هیچ‌وقت «فعال» نمی‌شوند. */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname || href.includes("?")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
