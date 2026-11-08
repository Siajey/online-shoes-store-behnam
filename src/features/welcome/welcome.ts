/** کلید حافظه‌ی مرورگر؛ بعد از دیدن صفحه‌ی خوش‌آمدگویی ثبت می‌شود. */
export const WELCOME_KEY = "welcome-seen";

/** عرضی که از آن به بالا (lg در Tailwind) دسکتاپ حساب می‌شود و خوش‌آمدگویی نشان داده نمی‌شود. */
export const DESKTOP_MIN_WIDTH = 1024;

type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** خواندن امن؛ حالت خصوصی مرورگر ممکن است خطا بدهد (در آن صورت «دیده نشده» حساب می‌شود). */
export function hasSeenWelcome(storage: StorageLike | null): boolean {
  try {
    return storage?.getItem(WELCOME_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWelcomeSeen(storage: StorageLike | null): void {
  try {
    storage?.setItem(WELCOME_KEY, "1");
  } catch {
    // ذخیره نشد؛ بار بعد دوباره نشان داده می‌شود و مشکلی ندارد.
  }
}

/** فقط موبایل و فقط بار اول. */
export function shouldShowWelcome(input: { isMobile: boolean; seen: boolean }): boolean {
  return input.isMobile && !input.seen;
}

export function safeLocalStorage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
