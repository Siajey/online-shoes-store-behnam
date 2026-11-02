import { describe, expect, it } from "vitest";
import { isActivePath } from "./nav";

describe("isActivePath", () => {
  it("خانه فقط روی ریشه فعال است", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/products", "/")).toBe(false);
  });
  it("زیرمسیرها فعال حساب می‌شوند", () => {
    expect(isActivePath("/products", "/products")).toBe(true);
    expect(isActivePath("/products/12", "/products")).toBe(true);
    expect(isActivePath("/productsx", "/products")).toBe(false);
  });
  it("لینک دارای query فعال نمی‌شود", () => {
    expect(isActivePath("/products", "/products?category=men")).toBe(false);
  });
  it("مسیر null امن است", () => {
    expect(isActivePath(null, "/")).toBe(false);
  });
});
