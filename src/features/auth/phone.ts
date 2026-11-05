import { toEnglishDigits } from "@/lib/format";

/**
 * شماره‌ی موبایل ایرانی را به شکل استاندارد ۰۹xxxxxxxxx درمی‌آورد؛ نامعتبر = null.
 * ارقام فارسی و عربی، فاصله، خط تیره و پیشوند +98 یا 0098 پذیرفته می‌شود.
 */
export function normalizePhone(input: string): string | null {
  const digits = toEnglishDigits(input).replace(/\D/g, "");
  if (/^09\d{9}$/.test(digits)) return digits;
  if (/^9\d{9}$/.test(digits)) return `0${digits}`;
  if (/^989\d{9}$/.test(digits)) return `0${digits.slice(2)}`;
  if (/^00989\d{9}$/.test(digits)) return `0${digits.slice(4)}`;
  return null;
}

/**
 * کد تأیید را تمیز می‌کند؛ نامعتبر = null.
 * طول ثابت فرض نمی‌شود (کد توسعه ۵ رقم و کد واقعی ۶ رقم است)، فقط ۴ تا ۸ رقم.
 */
export function normalizeOtp(input: string): string | null {
  const digits = toEnglishDigits(input).replace(/\D/g, "");
  return /^\d{4,8}$/.test(digits) ? digits : null;
}
