const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** رقم‌های لاتین را به فارسی تبدیل می‌کند. ورودی می‌تواند عدد یا متن باشد. */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** رقم‌های فارسی و عربی را به لاتین برمی‌گرداند (برای ورودی فرم‌ها پیش از ارسال به API). */
export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/**
 * قیمت را با جداکننده‌ی هزارگان و ارقام فارسی نشان می‌دهد.
 * فرض فعلی: API قیمت را به «تومان» و عدد صحیح می‌دهد (تصمیم D-011 باید با همکار نهایی شود).
 * اگر واحد API ریال شد، فقط همین تابع تغییر می‌کند.
 */
export function formatPrice(amount: number, opts: { unit?: string | false } = {}): string {
  const { unit = "تومان" } = opts;
  const n = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(amount);
  return unit ? `${n} ${unit}` : n;
}
