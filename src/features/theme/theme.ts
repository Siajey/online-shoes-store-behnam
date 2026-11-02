export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME: Theme = "dark";

/** هر مقدار نامعتبر (مثلاً دست‌کاری localStorage) به حالت پیش‌فرض برمی‌گردد. */
export function parseTheme(value: string | null | undefined): Theme {
  return value === "light" || value === "dark" ? value : DEFAULT_THEME;
}

export function nextTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}

/**
 * اسکریپت کوچکی که پیش از اولین رنگ‌آمیزی صفحه اجرا می‌شود،
 * تا کاربر در حالت روشن، لحظه‌ای صفحه‌ی تیره نبیند (پرش رنگ).
 */
export const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
