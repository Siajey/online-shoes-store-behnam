export type QueryValue =
  string | number | boolean | null | undefined | readonly (string | number)[];
export type QueryParams = Record<string, QueryValue>;

/**
 * پارامترهای query را می‌سازد. مقدارهای خالی حذف می‌شوند و آرایه‌ها با کاما به‌هم وصل می‌شوند
 * (☐ قالب آرایه با بک‌اند هماهنگ شود).
 */
export function buildQuery(params?: QueryParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "object") {
      if (value.length > 0) search.set(key, value.join(","));
      continue;
    }
    search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}
