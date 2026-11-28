import { describe, expect, it } from "vitest";
import { toShippingOption } from "./mappers";

describe("toShippingOption", () => {
  it("روش در دسترس: کد، هزینه و بازه‌ی تحویل", () => {
    expect(
      toShippingOption({
        methodCode: "post",
        name: "پست",
        description: "ارسال با پست",
        available: true,
        fee: 120_000,
        isFree: false,
        estimatedDays: { min: 3, max: 7 },
      }),
    ).toEqual({
      code: "post",
      name: "پست",
      description: "ارسال با پست",
      available: true,
      fee: 120_000,
      isFree: false,
      days: { min: 3, max: 7 },
    });
  });
  it("ارسال رایگان: هزینه صفر", () => {
    const o = toShippingOption({
      methodCode: "post",
      name: "پست",
      description: null,
      available: true,
      fee: 120_000,
      isFree: true,
      estimatedDays: null,
    });
    expect(o.isFree).toBe(true);
    expect(o.fee).toBe(0);
    expect(o.days).toBeNull();
  });
  it("غیرقابل ارائه: بدون هزینه و بازه", () => {
    const o = toShippingOption({
      methodCode: "express",
      name: "پیشتاز",
      description: null,
      available: false,
    });
    expect(o).toMatchObject({
      code: "express",
      available: false,
      fee: 0,
      isFree: false,
      days: null,
    });
  });
});
