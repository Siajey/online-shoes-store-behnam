import { describe, expect, it } from "vitest";
import { normalizeOtp, normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it.each([
    ["09120000000", "09120000000"],
    ["9120000000", "09120000000"],
    ["۰۹۱۲۰۰۰۰۰۰۰", "09120000000"],
    ["0912 000 0000", "09120000000"],
    ["0912-000-0000", "09120000000"],
    ["+989120000000", "09120000000"],
    ["00989120000000", "09120000000"],
    ["٠٩١٢٠٠٠٠٠٠٠", "09120000000"],
  ])("«%s» ← %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["", "0912", "08120000000", "091200000000", "abc", "02112345678"])(
    "نامعتبر: «%s»",
    (input) => {
      expect(normalizePhone(input)).toBeNull();
    },
  );
});

describe("normalizeOtp", () => {
  it("ارقام فارسی و فاصله را می‌پذیرد", () => {
    expect(normalizeOtp("۱۲۳۴۵")).toBe("12345");
    expect(normalizeOtp(" 123 456 ")).toBe("123456");
  });
  it.each(["", "123", "123456789", "abcd"])("نامعتبر: «%s»", (input) => {
    expect(normalizeOtp(input)).toBeNull();
  });
});
