import { describe, expect, it } from "vitest";
import { normalizeEmail } from "./newsletter";

describe("normalizeEmail", () => {
  it("فاصله و حروف بزرگ را تمیز می‌کند", () => {
    expect(normalizeEmail("  Ali@Example.com ")).toBe("ali@example.com");
  });
  it("ایمیل نامعتبر null می‌شود", () => {
    for (const bad of ["", "ali", "ali@", "ali@x", "a li@x.com", "@x.com"]) {
      expect(normalizeEmail(bad)).toBeNull();
    }
  });
  it("ایمیل خیلی بلند نامعتبر است", () => {
    expect(normalizeEmail(`${"a".repeat(250)}@x.com`)).toBeNull();
  });
});
