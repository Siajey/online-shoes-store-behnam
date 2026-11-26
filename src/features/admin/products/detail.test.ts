import { describe, expect, it } from "vitest";
import { normalizeAttributes, toVariant } from "./detail";

describe("normalizeAttributes", () => {
  it("آرایه‌ی {name, value} (شکل فعلی بک‌اند)", () => {
    expect(
      normalizeAttributes([
        { name: "size", value: "42" },
        { name: "color", value: "مشکی" },
      ]),
    ).toEqual({ size: "42", color: "مشکی" });
  });

  it("شکل شیء و مقدار عددی به رشته تبدیل می‌شود", () => {
    expect(normalizeAttributes({ size: 42, color: "آبی" })).toEqual({ size: "42", color: "آبی" });
  });

  it("خالی یا نبودن", () => {
    expect(normalizeAttributes(undefined)).toEqual({});
    expect(normalizeAttributes([])).toEqual({});
  });
});

describe("toVariant", () => {
  it("ویژگی‌های آرایه‌ای را می‌خواند و قیمت را بدون تبدیل نگه می‌دارد", () => {
    const v = toVariant({
      id: "v1",
      title: null,
      sku: "S-1",
      price: 21_900_000,
      stock: 3,
      isActive: true,
      attributes: [{ name: "size", value: "42" }],
    });
    expect(v.attributes).toEqual({ size: "42" });
    expect(v.price).toBe(21_900_000);
    expect(v.title).toBe("S-1");
  });
});
