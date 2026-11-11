import { toEnglishDigits } from "@/lib/format";

/** ایمیل را تمیز می‌کند؛ نامعتبر = null. بررسی ساده است و بک‌اند بررسی نهایی را انجام می‌دهد. */
export function normalizeEmail(input: string): string | null {
  const value = toEnglishDigits(input).trim().toLowerCase();
  if (value.length > 254) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? value : null;
}
