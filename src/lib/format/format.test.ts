import { describe, expect, it } from "vitest";
import { formatPrice, toEnglishDigits, toPersianDigits } from "./index";

describe("toPersianDigits", () => {
  it("تبدیل ارقام لاتین به فارسی", () => {
    expect(toPersianDigits(1405)).toBe("۱۴۰۵");
    expect(toPersianDigits("09123456789")).toBe("۰۹۱۲۳۴۵۶۷۸۹");
  });
});

describe("toEnglishDigits", () => {
  it("ارقام فارسی و عربی را لاتین می‌کند", () => {
    expect(toEnglishDigits("۰۹۱۲۳۴۵۶۷۸۹")).toBe("09123456789");
    expect(toEnglishDigits("٠١٢")).toBe("012");
  });
});

describe("formatPrice", () => {
  it("جداکننده‌ی هزارگان و واحد", () => {
    expect(formatPrice(2_190_000)).toBe("۲٬۱۹۰٬۰۰۰ تومان");
  });
  it("بدون واحد", () => {
    expect(formatPrice(80_000, { unit: false })).toBe("۸۰٬۰۰۰");
  });
  it("صفر", () => {
    expect(formatPrice(0)).toBe("۰ تومان");
  });
});
