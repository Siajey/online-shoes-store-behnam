import { describe, expect, it } from "vitest";
import { resolveShippingCode } from "./choice";
import type { ShippingOption } from "./types";

const opt = (code: string, available = true): ShippingOption => ({
  code,
  name: code,
  description: null,
  available,
  fee: 0,
  isFree: false,
  days: null,
});

describe("resolveShippingCode", () => {
  it("انتخاب کاربر اگر در دسترس است", () => {
    expect(resolveShippingCode([opt("post"), opt("express")], "express")).toBe("express");
  });
  it("بدون انتخاب: اولین روش در دسترس", () => {
    expect(resolveShippingCode([opt("post", false), opt("express")], null)).toBe("express");
  });
  it("انتخاب قبلی دیگر در دسترس نیست: اولین در دسترس", () => {
    expect(resolveShippingCode([opt("post"), opt("express", false)], "express")).toBe("post");
  });
  it("هیچ روشی در دسترس نیست: null", () => {
    expect(resolveShippingCode([opt("post", false)], "post")).toBeNull();
    expect(resolveShippingCode([], null)).toBeNull();
  });
});
