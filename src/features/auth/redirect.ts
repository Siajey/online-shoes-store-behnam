/** مقصد پیش‌فرض بعد از ورود */
export const DEFAULT_AFTER_LOGIN = "/account";

/**
 * مقصد بعد از ورود (پارامتر next) را فقط وقتی می‌پذیرد که مسیر داخلی همین سایت باشد.
 * جلوی redirect به سایت دیگر (open redirect) را می‌گیرد.
 */
export function safeNext(value: string | null | undefined): string {
  if (!value || value.length > 200) return DEFAULT_AFTER_LOGIN;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return DEFAULT_AFTER_LOGIN;
  }
  if (/[\u0000-\u001f]/.test(value)) return DEFAULT_AFTER_LOGIN;
  // مسیرهای ورود، دوباره به ورود برنگردند.
  if (value === "/login" || value.startsWith("/login?") || value.startsWith("/login/")) {
    return DEFAULT_AFTER_LOGIN;
  }
  return value;
}
