import { describe, expect, it } from "vitest";
import { DEFAULT_AFTER_LOGIN, safeNext } from "./redirect";

describe("safeNext", () => {
  it.each(["/cart", "/products?category=mens-shoes", "/account/orders"])("%s را می‌پذیرد", (v) => {
    expect(safeNext(v)).toBe(v);
  });
  it.each([
    undefined,
    null,
    "",
    "cart",
    "//evil.com",
    "https://evil.com",
    "/\\evil.com",
    "javascript:alert(1)",
    "/login",
    "/login?next=/cart",
    "/a\nb",
    "/" + "a".repeat(250),
  ])("%s ← مسیر پیش‌فرض", (v) => {
    expect(safeNext(v as string | null | undefined)).toBe(DEFAULT_AFTER_LOGIN);
  });
});
