import { describe, expect, it } from "vitest";
import { validateAddress } from "./validation";

const ok = { province: "تهران", city: "تهران", street: "خیابان آزادی", postalCode: "1234567890" };

describe("validateAddress", () => {
  it("معتبر", () => {
    expect(validateAddress(ok)).toEqual({ ok: true, value: ok });
  });
  it("ارقام فارسی کدپستی به انگلیسی تبدیل می‌شود", () => {
    const r = validateAddress({ ...ok, postalCode: "۱۲۳۴۵۶۷۸۹۰" });
    expect(r.ok && r.value.postalCode).toBe("1234567890");
  });
  it("خالی بودن همه: الزامی", () => {
    const r = validateAddress({ province: " ", city: "", street: "", postalCode: "" });
    expect(r).toEqual({
      ok: false,
      errors: {
        province: "required",
        city: "required",
        street: "required",
        postalCode: "required",
      },
    });
  });
  it("کدپستی نادرست", () => {
    for (const bad of ["123", "12345678901", "12345abcde"]) {
      expect(validateAddress({ ...ok, postalCode: bad })).toEqual({
        ok: false,
        errors: { postalCode: "postalCode" },
      });
    }
  });
  it("بیش از ۱۰۰ حرف", () => {
    expect(validateAddress({ ...ok, street: "ا".repeat(101) })).toEqual({
      ok: false,
      errors: { street: "tooLong" },
    });
    expect(validateAddress({ ...ok, street: "ا".repeat(100) }).ok).toBe(true);
  });
});
