import { describe, expect, it } from "vitest";
import { parseReverseGeocode } from "./geocoding";

describe("parseReverseGeocode", () => {
  it("پاسخ کامل به فیلدهای آدرس", () => {
    const out = parseReverseGeocode({
      address: {
        state: "استان آذربایجان غربی",
        city: "مهاباد",
        suburb: "محله‌ی نمونه",
        road: "خیابان جمهوری",
        postcode: "5916766384",
      },
    });
    expect(out).toEqual({
      province: "آذربایجان غربی",
      city: "مهاباد",
      street: "محله‌ی نمونه، خیابان جمهوری",
      postalCode: "5916766384",
    });
  });
  it("شهر از شهرستان یا شهر کوچک و پیشوند «شهرستان» حذف می‌شود", () => {
    expect(
      parseReverseGeocode({ address: { state: "استان تهران", county: "شهرستان ری" } }),
    ).toEqual({
      province: "تهران",
      city: "ری",
    });
    expect(parseReverseGeocode({ address: { town: "بومهن" } })).toEqual({ city: "بومهن" });
  });
  it("کدپستی ناقص نادیده گرفته می‌شود و ارقام فارسی تبدیل می‌شوند", () => {
    expect(parseReverseGeocode({ address: { city: "قم", postcode: "37" } })).toEqual({
      city: "قم",
    });
    expect(parseReverseGeocode({ address: { city: "قم", postcode: "۳۷۱۹۱۲۳۴۵۶" } })).toEqual({
      city: "قم",
      postalCode: "3719123456",
    });
  });
  it("نشانی بلند به ۱۰۰ حرف بریده می‌شود", () => {
    const out = parseReverseGeocode({ address: { road: "ا".repeat(150) } });
    expect(out?.street?.length).toBe(100);
  });
  it("خطا، خالی یا ورودی نامعتبر: null", () => {
    expect(parseReverseGeocode({ error: "Unable to geocode" })).toBeNull();
    expect(parseReverseGeocode({ address: {} })).toBeNull();
    expect(parseReverseGeocode(null)).toBeNull();
    expect(parseReverseGeocode("x")).toBeNull();
  });
});
