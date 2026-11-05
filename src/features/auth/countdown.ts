import { toPersianDigits } from "@/lib/format";

/** ثانیه‌ها را به «۰۱:۴۵» (دقیقه:ثانیه، ارقام فارسی) تبدیل می‌کند. */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return toPersianDigits(`${mm}:${ss}`);
}
