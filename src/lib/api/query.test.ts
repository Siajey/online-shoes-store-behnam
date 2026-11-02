import { describe, expect, it } from "vitest";
import { buildQuery } from "./query";

describe("buildQuery", () => {
  it("بدون پارامتر رشته‌ی خالی می‌دهد", () => {
    expect(buildQuery()).toBe("");
    expect(buildQuery({})).toBe("");
  });
  it("مقدارهای خالی را حذف می‌کند", () => {
    expect(buildQuery({ a: undefined, b: null, c: "", d: 0, e: false })).toBe("?d=0&e=false");
  });
  it("آرایه را با کاما وصل می‌کند و آرایه‌ی خالی را حذف می‌کند", () => {
    expect(buildQuery({ sizes: [40, 41], none: [] })).toBe("?sizes=40%2C41");
  });
  it("متن فارسی را درست کد می‌کند", () => {
    expect(buildQuery({ q: "کفش" })).toBe("?q=%DA%A9%D9%81%D8%B4");
  });
});
