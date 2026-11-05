/**
 * همه‌ی مقدارهایی که هنوز با همکار بک‌اند نهایی نشده‌اند فقط اینجا هستند.
 * وقتی جواب آمد، فقط همین فایل را عوض کنید (☐ = منتظر تأیید).
 */
export const apiConfig = {
  /** پیشوند و نسخه (قطعی) */
  prefix: "/api/v1",
  /**
   * زبان پیام‌ها. بک‌اند به‌طور پیش‌فرض فارسی جواب می‌دهد، پس هدر نمی‌فرستیم.
   * (هدر سفارشی باعث preflight می‌شود و CORS بک‌اند فعلاً x-lang را مجاز نکرده است.)
   * برای فعال کردن: langHeader را "x-lang" بگذارید و از همکار بخواهید در allowedHeaders اضافه کند.
   */
  langHeader: null as string | null,
  lang: "fa",
  endpoints: {
    /** تأیید‌شده با کد بک‌اند (auth.controller): POST و کوکی csrf_secret می‌نشاند */
    csrf: "/auth/csrf-token",
    refresh: "/auth/refresh-token",
  },
  csrfMethod: "POST" as "POST" | "GET",
  /** روش refresh-token (تأیید‌شده) */
  refreshMethod: "POST" as "POST" | "GET",
  /** تأیید‌شده با CSRFGuard بک‌اند. ☐ CORS بک‌اند باید این هدر را در allowedHeaders داشته باشد. */
  csrfHeader: "x-csrf-token",
  /** پاسخ واقعی: data.csrfToken (هم برای /auth/csrf-token و هم برای /auth/verify-login-otp) */
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
