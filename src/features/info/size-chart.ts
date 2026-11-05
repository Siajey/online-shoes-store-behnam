export type SizeRow = {
  /** سایز اروپایی */
  eu: number;
  /** طول پا به سانتی‌متر */
  footCm: number;
};

/** محدوده‌ی سایزهای نمایش‌داده‌شده */
export const EU_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46] as const;

/**
 * طول پا برای هر سایز اروپایی (مقیاس Paris point: هر سایز ۲/۳ سانتی‌متر).
 * فرمول تقریبی: سایز × ۲/۳ منهای ۱٫۵ سانتی‌متر (فضای انگشتان).
 * ☐ برندها ممکن است کمی فرق داشته باشند؛ اگر جدول رسمی تأمین‌کننده را دارید، جایگزین کنید.
 */
export function footLengthCm(eu: number): number {
  return Math.round(((eu * 2) / 3 - 1.5) * 10) / 10;
}

export const sizeChart: SizeRow[] = EU_SIZES.map((eu) => ({ eu, footCm: footLengthCm(eu) }));
