import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, nextTheme, parseTheme, themeInitScript } from "./theme";

describe("theme", () => {
  it("مقدار معتبر را برمی‌گرداند", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
  });
  it("مقدار نامعتبر یا خالی به پیش‌فرض برمی‌گردد", () => {
    expect(parseTheme("blue")).toBe(DEFAULT_THEME);
    expect(parseTheme(null)).toBe(DEFAULT_THEME);
    expect(parseTheme(undefined)).toBe(DEFAULT_THEME);
  });
  it("nextTheme بین دو حالت جابه‌جا می‌شود", () => {
    expect(nextTheme("dark")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
  });
  it("اسکریپت اولیه کلید ذخیره‌سازی را دارد و خطا را می‌بلعد", () => {
    expect(themeInitScript).toContain('"theme"');
    expect(themeInitScript).toContain("catch");
  });
});
