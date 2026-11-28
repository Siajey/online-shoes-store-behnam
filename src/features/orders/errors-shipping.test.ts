import { describe, expect, it } from "vitest";
import { ApiRequestError } from "@/lib/api/errors";
import { classifyPlaceOrderError, needsFreshKey } from "./errors";

const err = (code: string) => new ApiRequestError({ status: 409, code, message: "x" });

describe("classifyPlaceOrderError: ارسال", () => {
  it("روش ارسال نامعتبر یا قیمت‌گیری ناممکن: پیام فارسی و کلید تازه", () => {
    for (const code of [
      "SHIPPING_QUOTE_UNAVAILABLE",
      "SHIPPING_INVALID_METHOD",
      "SHIPPING_METHOD_NOT_FOUND",
    ]) {
      const f = classifyPlaceOrderError(err(code));
      expect(f).toMatchObject({ kind: "shipping" });
      expect(needsFreshKey(f)).toBe(true);
    }
  });
  it("آدرس نامعتبر برای ارسال", () => {
    expect(classifyPlaceOrderError(err("SHIPPING_INVALID_DESTINATION"))).toMatchObject({
      kind: "shipping",
    });
  });
});
