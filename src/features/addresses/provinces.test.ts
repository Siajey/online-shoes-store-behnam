import { describe, expect, it } from "vitest";
import { PROVINCES, matchProvince, normalizeName, provinceOptions } from "./provinces";

describe("provinces", () => {
  it("۳۱ استان یکتا", () => {
    expect(PROVINCES.length).toBe(31);
    expect(new Set(PROVINCES).size).toBe(31);
  });
  it("نرمال‌سازی ی و ک عربی، فاصله و پیشوند استان", () => {
    expect(normalizeName("استان آذربایجان‌غربی")).toBe(normalizeName("آذربایجان غربی"));
    expect(normalizeName("كرمان")).toBe(normalizeName("کرمان"));
  });
  it("تطبیق نام از نتیجه‌ی نقشه", () => {
    expect(matchProvince("استان تهران")).toBe("تهران");
    expect(matchProvince("استان آذربایجان غربی")).toBe("آذربایجان غربی");
    expect(matchProvince("Tehran")).toBeNull();
    expect(matchProvince(undefined)).toBeNull();
  });
  it("مقدار ناشناخته‌ی فعلی به ابتدای گزینه‌ها اضافه می‌شود", () => {
    expect(provinceOptions("تهران").length).toBe(31);
    const opts = provinceOptions("نام قدیمی");
    expect(opts.length).toBe(32);
    expect(opts[0].value).toBe("نام قدیمی");
  });
});
