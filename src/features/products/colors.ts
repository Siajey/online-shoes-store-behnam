/** نام ویژگی «رنگ» و «سایز» در داده‌ی بک‌اند. */
export const COLOR_ATTRIBUTE = "رنگ";
export const SIZE_ATTRIBUTE = "سایز";

const normalize = (s: string) =>
  s
    .replace(/[\u200c\s]+/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک");

/** بک‌اند ممکن است نام ویژگی را فارسی (رنگ) یا انگلیسی (color) نگه دارد. */
export const isColorAttribute = (name: string) => /رنگ|colou?r/i.test(normalize(name));
export const isSizeAttribute = (name: string) => /سایز|size/i.test(normalize(name));

const NAMED: Record<string, string> = {
  مشکی: "#1a1a1a",
  سیاه: "#1a1a1a",
  سفید: "#f5f5f5",
  قرمز: "#d93a2f",
  آبی: "#2b78d4",
  آبیروشن: "#7db7ee",
  سرمهای: "#1f2f57",
  سبز: "#3f9a55",
  زرد: "#e5b73a",
  نارنجی: "#ea5b2b",
  بنفش: "#7a4fb3",
  صورتی: "#ec82a8",
  قهوهای: "#7a4a2b",
  خاکستری: "#8b8f98",
  طوسی: "#9ca3af",
  کرم: "#efe3c8",
  کرمی: "#efe3c8",
  بژ: "#d9c3a0",
  طلایی: "#c9a227",
  نقرهای: "#c0c4cc",
  فیروزهای: "#3cc2b4",
  زرشکی: "#7b1e2e",
  یشمی: "#5f8f6b",
};

/** رنگ نمایشی یک مقدار ویژگی رنگ؛ اگر شناخته نشد undefined (نمایش خنثی). */
export function colorHex(name: string): string | undefined {
  const raw = name.trim();
  if (/^#[0-9a-f]{3,8}$/i.test(raw)) return raw;
  return NAMED[normalize(raw)];
}

/** حداکثر چند رنگ روی کارت محصول دیده شود؛ بقیه فقط در صفحه‌ی خود محصول. */
export const MAX_CARD_COLORS = 3;
