import { describe, expect, it } from "vitest";
import { activeFilterCount, parseProductFilters, productsHref } from "./filters";

describe("فیلتر و مرتب‌سازی", () => {
  it("مرتب‌سازی معتبر و نامعتبر", () => {
    expect(parseProductFilters({ sort: "price-asc" }).sort).toBe("price-asc");
    expect(parseProductFilters({ sort: "evil" }).sort).toBeUndefined();
  });
  it("قیمت: ارقام فارسی، جداکننده، نامعتبر و جابه‌جایی کمینه/بیشینه", () => {
    const f = parseProductFilters({ minPrice: "۱,۰۰۰,۰۰۰", maxPrice: "500000" });
    expect(f.minPrice).toBe(500000);
    expect(f.maxPrice).toBe(1000000);
    expect(parseProductFilters({ minPrice: "abc" }).minPrice).toBeUndefined();
    expect(parseProductFilters({ minPrice: "-5" }).minPrice).toBeUndefined();
    expect(parseProductFilters({ maxPrice: "99999999999" }).maxPrice).toBeUndefined();
  });
  it("موجودی فقط با ۱", () => {
    expect(parseProductFilters({ inStock: "1" }).inStock).toBe(true);
    expect(parseProductFilters({ inStock: "true" }).inStock).toBeUndefined();
  });
  it("شمارش فیلتر فعال", () => {
    expect(activeFilterCount({})).toBe(0);
    expect(activeFilterCount({ minPrice: 1, maxPrice: 5, inStock: true })).toBe(2);
  });
  it("ساخت آدرس و override", () => {
    expect(productsHref({})).toBe("/products");
    const f = { category: "men", sort: "price-asc" as const, minPrice: 100, inStock: true };
    expect(productsHref(f)).toBe("/products?category=men&sort=price-asc&minPrice=100&inStock=1");
    expect(productsHref(f, { sort: undefined, minPrice: undefined })).toBe(
      "/products?category=men&inStock=1",
    );
  });
});
