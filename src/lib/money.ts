/**
 * بک‌اند همه‌ی قیمت‌ها را به «ریال» می‌دهد و می‌گیرد؛ فروشگاه به «تومان» نمایش می‌دهد.
 * تبدیل فقط در مرز API (mapper و پارامتر درخواست) انجام می‌شود و بقیه‌ی برنامه فقط تومان می‌بیند.
 */
export const RIAL_PER_TOMAN = 10;

export const rialToToman = (rial: number): number => Math.round(rial / RIAL_PER_TOMAN);
export const tomanToRial = (toman: number): number => toman * RIAL_PER_TOMAN;
