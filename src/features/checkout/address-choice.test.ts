import { describe, expect, it } from "vitest";
import { resolveSelectedAddressId } from "./address-choice";

const a = (id: string, isDefault = false) => ({
  id,
  province: "p",
  city: "c",
  street: "s",
  postalCode: "1234567890",
  isDefault,
});

describe("resolveSelectedAddressId", () => {
  it("فهرست خالی: هیچ", () => {
    expect(resolveSelectedAddressId([], null)).toBeNull();
    expect(resolveSelectedAddressId([], "x")).toBeNull();
  });
  it("پیش‌فرض را انتخاب می‌کند", () => {
    expect(resolveSelectedAddressId([a("1"), a("2", true)], null)).toBe("2");
  });
  it("بدون پیش‌فرض: اولی", () => {
    expect(resolveSelectedAddressId([a("1"), a("2")], null)).toBe("1");
  });
  it("انتخاب فعلی معتبر حفظ می‌شود", () => {
    expect(resolveSelectedAddressId([a("1"), a("2", true)], "1")).toBe("1");
  });
  it("انتخاب حذف‌شده به پیش‌فرض برمی‌گردد", () => {
    expect(resolveSelectedAddressId([a("2", true)], "gone")).toBe("2");
  });
});
