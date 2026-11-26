import { describe, expect, it } from "vitest";
import { toAdminCoupon, toAdminDiscount, toCouponUsage } from "./mappers";

const scope = { type: "all" as const, targetIds: [] };
const base = {
  id: "d1",
  name: "حراج",
  scope,
  startsAt: null,
  endsAt: null,
  isActive: true,
  createdAt: "2026-06-20T10:00:00.000Z",
  updatedAt: "2026-06-20T10:00:00.000Z",
};

describe("discount mappers", () => {
  it("درصد همان می‌ماند و سقف همان می‌ماند (تومان)", () => {
    const d = toAdminDiscount({ ...base, kind: "percent", value: 20, maxDiscountPerUnit: 500_000 });
    expect(d.value).toBe(20);
    expect(d.maxDiscountPerUnit).toBe(500_000);
  });
  it("مبلغ ثابت بدون تبدیل (تومان)", () => {
    expect(
      toAdminDiscount({ ...base, kind: "fixed", value: 1_000_000, maxDiscountPerUnit: null }).value,
    ).toBe(1_000_000);
  });
  it("کوپن: سقف، حداقل سفارش و محدودیت‌ها", () => {
    const c = toAdminCoupon({
      ...base,
      code: "SUMMER20",
      kind: "percent",
      value: 20,
      maxDiscount: 500_000,
      minOrderAmount: 1_000_000,
      applyToDiscountedItems: false,
      usageLimitTotal: 1000,
      usageLimitPerUser: null,
    });
    expect(c.maxDiscount).toBe(500_000);
    expect(c.minOrderAmount).toBe(1_000_000);
    expect(c.usageLimitTotal).toBe(1000);
    expect(c.usageLimitPerUser).toBeNull();
  });
  it("آمار استفاده: مجموع تخفیف به تومان", () => {
    expect(
      toCouponUsage({ reserved: 5, committed: 42, released: 3, totalDiscount: 12_500_000 }),
    ).toEqual({
      reserved: 5,
      committed: 42,
      released: 3,
      totalDiscount: 12_500_000,
    });
  });
});
