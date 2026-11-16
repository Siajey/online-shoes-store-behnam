import { describe, expect, it } from "vitest";
import {
  activeFilterCount,
  attributesParam,
  filterFields,
  parseProductFilters,
  productsHref,
} from "./filters";

describe("فیلترهای رنگ، سایز، برند و صفحه", () => {
  it("رنگ و سایز چندتایی را می‌خواند و تکراری را حذف می‌کند", () => {
    const f = parseProductFilters({ color: ["مشکی", "مشکی", "سفید"], size: "۴۲", brand: "nike" });
    expect(f.colors).toEqual(["مشکی", "سفید"]);
    expect(f.sizes).toEqual(["۴۲"]);
    expect(f.brand).toBe("nike");
  });
  it("مقدار خالی یا نامعتبر نادیده گرفته می‌شود", () => {
    const f = parseProductFilters({ color: ["", "  "], brand: "a b", page: "abc" });
    expect(f.colors).toBeUndefined();
    expect(f.brand).toBeUndefined();
    expect(f.page).toBeUndefined();
  });
  it("صفحه: ۱ و بیشتر از سقف نادیده، عدد فارسی پذیرفته", () => {
    expect(parseProductFilters({ page: "1" }).page).toBeUndefined();
    expect(parseProductFilters({ page: "99" }).page).toBeUndefined();
    expect(parseProductFilters({ page: "3" }).page).toBe(3);
    expect(parseProductFilters({ page: "۴" }).page).toBe(4);
  });
  it("شمارنده‌ی فیلتر فعال", () => {
    expect(activeFilterCount({ colors: ["a"], sizes: ["1"], brand: "x", inStock: true })).toBe(4);
  });
  it("attributesParam قالب بک‌اند را می‌سازد", () => {
    expect(attributesParam({ رنگ: ["مشکی", "سفید"], سایز: ["42"] })).toBe("رنگ:مشکی,سفید;سایز:42");
    expect(attributesParam({ رنگ: undefined, سایز: [] })).toBeUndefined();
  });
  it("filterFields مقدارهای skip را کنار می‌گذارد", () => {
    const names = filterFields({ q: "ab", colors: ["x"], minPrice: 5 }, ["color"]).map(
      (f) => f.name,
    );
    expect(names).toEqual(["q", "minPrice"]);
  });
  it("productsHref فیلتر را حفظ و صفحه را با تغییر فیلتر صفر می‌کند", () => {
    const f = { colors: ["مشکی"], page: 3 };
    expect(productsHref(f, { sort: "price-asc" })).not.toContain("page=");
    expect(productsHref(f, { page: 4 })).toContain("page=4");
    expect(productsHref({}, {})).toBe("/products");
  });
});
