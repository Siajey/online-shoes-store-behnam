import { describe, expect, it } from "vitest";
import { parseProductFilters } from "./filters";

describe("parseProductFilters", () => {
  it("مقدار معتبر را برمی‌گرداند", () => {
    expect(parseProductFilters({ category: "mens-shoes", q: "نایک" })).toEqual({
      category: "mens-shoes",
      q: "نایک",
    });
  });
  it("خالی یا بدون پارامتر، undefined می‌دهد", () => {
    expect(parseProductFilters({})).toEqual({ category: undefined, q: undefined });
    expect(parseProductFilters({ category: "", q: "   " })).toEqual({
      category: undefined,
      q: undefined,
    });
  });
  it("آرایه را به اولین مقدار تبدیل می‌کند", () => {
    expect(parseProductFilters({ category: ["a-b", "c"] }).category).toBe("a-b");
  });
  it("slug نامعتبر نادیده گرفته می‌شود", () => {
    expect(parseProductFilters({ category: "a/../b" }).category).toBeUndefined();
    expect(parseProductFilters({ category: "x y" }).category).toBeUndefined();
    expect(parseProductFilters({ category: "<script>" }).category).toBeUndefined();
  });
  it("عبارت جستجو به ۱۰۰ نویسه محدود می‌شود", () => {
    expect(parseProductFilters({ q: "a".repeat(300) }).q).toHaveLength(100);
  });
});
