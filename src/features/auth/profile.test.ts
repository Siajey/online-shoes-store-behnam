import { describe, expect, it } from "vitest";
import { MAX_NAME_LENGTH, validateProfile } from "./profile";

describe("validateProfile", () => {
  it("مقدار معتبر را تمیز می‌کند", () => {
    expect(validateProfile({ firstName: "  علی ", lastName: "محمدی   زاده" })).toEqual({
      ok: true,
      value: { firstName: "علی", lastName: "محمدی زاده" },
    });
  });
  it("خالی یا فقط فاصله: الزامی", () => {
    expect(validateProfile({ firstName: "", lastName: "   " })).toEqual({
      ok: false,
      errors: { firstName: "required", lastName: "required" },
    });
  });
  it("بیشتر از ۲۰ حرف: طولانی", () => {
    const long = "ا".repeat(MAX_NAME_LENGTH + 1);
    expect(validateProfile({ firstName: long, lastName: "ب" })).toEqual({
      ok: false,
      errors: { firstName: "tooLong" },
    });
  });
  it("دقیقاً ۲۰ حرف مجاز است", () => {
    expect(validateProfile({ firstName: "ا".repeat(MAX_NAME_LENGTH), lastName: "ب" }).ok).toBe(
      true,
    );
  });
});
