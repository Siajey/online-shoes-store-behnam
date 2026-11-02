/**
 * همه‌ی مقدارهایی که هنوز با همکار بک‌اند نهایی نشده‌اند فقط اینجا هستند.
 * وقتی جواب آمد، فقط همین فایل را عوض کنید (☐ = منتظر تأیید).
 */
export const apiConfig = {
  /** پیشوند و نسخه (قطعی) */
  prefix: "/api/v1",
  /** زبان پیام‌های سرور (قطعی: هدر پیشنهادی x-lang) */
  langHeader: "x-lang",
  lang: "fa",
  endpoints: {
    csrf: "/csrf-token",
    refresh: "/refresh-token",
  },
  /** ☐ روش refresh-token هنوز تأیید نشده */
  refreshMethod: "POST" as "POST" | "GET",
  /** ☐ نام هدر CSRF هنوز تأیید نشده */
  csrfHeader: "x-csrf-token",
  /** ☐ شکل data در پاسخ /csrf-token در Swagger مشخص می‌شود. فعلاً چند حالت رایج را می‌پذیرد. */
  extractCsrfToken(data: unknown): string | null {
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      for (const key of ["csrfToken", "token"]) {
        if (typeof d[key] === "string") return d[key] as string;
      }
    }
    return null;
  },
} as const;
