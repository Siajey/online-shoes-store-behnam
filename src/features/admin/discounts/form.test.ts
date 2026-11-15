import { describe, expect, it } from "vitest";
import {
  EMPTY_OFFER,
  fromCoupon,
  normalizeCode,
  splitIds,
  toLocalInput,
  validateOffer,
  type OfferFormInput,
} from "./form";

const U1 = "550e8400-e29b-41d4-a716-446655440000";
const U2 = "550e8400-e29b-41d4-a716-446655440001";
const form = (over: Partial<OfferFormInput> = {}): OfferFormInput => ({
  ...EMPTY_OFFER,
  name: "حراج تابستان",
  value: "20",
  ...over,
});

describe("validateOffer: تخفیف", () => {
  it("درصدی معتبر", () => {
    const r = validateOffer(form(), "discount");
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(r.payload).toMatchObject({
        name: "حراج تابستان",
        kind: "percent",
        value: 20,
        maxDiscountPerUnit: null,
        scope: { type: "all", targetIds: [] },
        startsAt: null,
        endsAt: null,
        isActive: true,
      });
  });
  it("مبلغ ثابت و سقف به ریال می‌رود؛ ارقام فارسی و جداکننده پذیرفته", () => {
    const r = validateOffer(form({ kind: "fixed", value: "۱۰۰٬۰۰۰", cap: "50,000" }), "discount");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.payload).toMatchObject({ value: 1_000_000, maxDiscountPerUnit: 500_000 });
  });
  it("نام خالی، مقدار خالی یا نامعتبر", () => {
    const r = validateOffer(form({ name: " ", value: "" }), "discount");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toEqual({ name: "required", value: "required" });
    const bad = validateOffer(form({ value: "1.5" }), "discount");
    if (!bad.ok) expect(bad.errors.value).toBe("number");
    expect(bad.ok).toBe(false);
  });
  it("درصد بالای ۱۰۰ و صفر نامعتبر", () => {
    const r = validateOffer(form({ value: "101" }), "discount");
    if (!r.ok) expect(r.errors.value).toBe("percentMax");
    expect(r.ok).toBe(false);
    expect(validateOffer(form({ value: "0" }), "discount").ok).toBe(false);
  });
  it("مبلغ ثابت سقف درصد ندارد", () => {
    expect(validateOffer(form({ kind: "fixed", value: "500" }), "discount").ok).toBe(true);
  });
});

describe("validateOffer: شمول", () => {
  it("دسته‌بندی بدون انتخاب: خطا؛ با انتخاب: معتبر", () => {
    const none = validateOffer(form({ scopeType: "category" }), "discount");
    if (!none.ok) expect(none.errors.targetIds).toBe("scope");
    expect(none.ok).toBe(false);
    const ok = validateOffer(form({ scopeType: "brand", targetIds: [U1, U1, U2] }), "discount");
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.payload.scope).toEqual({ type: "brand", targetIds: [U1, U2] });
  });
  it("محصول: شناسه‌ها از متن، بدون تکرار؛ غیر UUID خطا", () => {
    const ok = validateOffer(
      form({ scopeType: "product", idsText: `${U1}\n${U2}, ${U1}` }),
      "discount",
    );
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.payload.scope).toEqual({ type: "product", targetIds: [U1, U2] });
    const bad = validateOffer(form({ scopeType: "variant", idsText: "abc" }), "discount");
    if (!bad.ok) expect(bad.errors.idsText).toBe("uuid");
    expect(bad.ok).toBe(false);
  });
  it("بیش از ۵۰۰ مورد", () => {
    const ids = Array.from(
      { length: 501 },
      (_, i) => `550e8400-e29b-41d4-a716-${String(i).padStart(12, "0")}`,
    );
    const r = validateOffer(form({ scopeType: "product", idsText: ids.join("\n") }), "discount");
    if (!r.ok) expect(r.errors.idsText).toBe("tooMany");
    expect(r.ok).toBe(false);
  });
  it("همه: targetIds خالی می‌ماند حتی اگر قبلاً چیزی انتخاب شده بود", () => {
    const r = validateOffer(form({ scopeType: "all", targetIds: [U1] }), "discount");
    if (r.ok) expect(r.payload.scope).toEqual({ type: "all", targetIds: [] });
    expect(r.ok).toBe(true);
  });
});

describe("validateOffer: بازه", () => {
  it("شروع بعد از پایان خطا می‌دهد", () => {
    const r = validateOffer(
      form({ startsAt: "2026-08-01T00:00", endsAt: "2026-07-01T00:00" }),
      "discount",
    );
    if (!r.ok) expect(r.errors.endsAt).toBe("period");
    expect(r.ok).toBe(false);
  });
  it("تاریخ به ISO با Z تبدیل می‌شود", () => {
    const r = validateOffer(
      form({ startsAt: "2026-07-01T10:00", endsAt: "2026-08-01T10:00" }),
      "discount",
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(String(r.payload.startsAt)).toMatch(/Z$/);
      expect(String(r.payload.endsAt)).toMatch(/Z$/);
    }
  });
  it("رفت‌وبرگشت تاریخ", () => {
    const iso = new Date(2026, 6, 1, 10, 30).toISOString();
    expect(toLocalInput(iso)).toBe("2026-07-01T10:30");
    expect(toLocalInput(null)).toBe("");
  });
});

describe("validateOffer: کوپن", () => {
  const coupon = (over: Partial<OfferFormInput> = {}) => form({ code: "summer20", ...over });
  it("کد نرمال‌سازی می‌شود و فیلدهای کوپن می‌روند", () => {
    const r = validateOffer(
      coupon({ minOrder: "1,000", usageTotal: "1000", usagePerUser: "۲", applyToDiscounted: true }),
      "coupon",
    );
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(r.payload).toMatchObject({
        code: "SUMMER20",
        minOrderAmount: 10_000,
        usageLimitTotal: 1000,
        usageLimitPerUser: 2,
        applyToDiscountedItems: true,
        maxDiscount: null,
      });
  });
  it("کد کوتاه یا نامعتبر", () => {
    for (const code of ["ab", "bad code", "x".repeat(31), "کد"]) {
      const r = validateOffer(coupon({ code }), "coupon");
      expect(r.ok).toBe(false);
    }
  });
  it("در ویرایش، code فرستاده نمی‌شود و بررسی هم نمی‌شود", () => {
    const r = validateOffer(coupon({ code: "" }), "coupon", { editing: true });
    expect(r.ok).toBe(true);
    if (r.ok) expect("code" in r.payload).toBe(false);
  });
  it("تخفیف فیلد کوپن نمی‌فرستد", () => {
    const r = validateOffer(coupon(), "discount");
    if (r.ok) expect("code" in r.payload).toBe(false);
    expect(r.ok).toBe(true);
  });
  it("محدودیت نامعتبر", () => {
    const r = validateOffer(coupon({ usageTotal: "-1" }), "coupon");
    if (!r.ok) expect(r.errors.usageTotal).toBe("number");
    expect(r.ok).toBe(false);
  });
});

describe("کمکی‌ها", () => {
  it("normalizeCode", () => {
    expect(normalizeCode(" summer۲۰ ")).toBe("SUMMER20");
  });
  it("splitIds", () => {
    expect(splitIds("a b\nc,a")).toEqual(["a", "b", "c"]);
  });
  it("fromCoupon فرم را برمی‌گرداند و idsText فقط برای محصول/ترکیب پر می‌شود", () => {
    const f = fromCoupon({
      id: "c",
      code: "X1X",
      name: "n",
      kind: "fixed",
      value: 1000,
      maxDiscount: null,
      minOrderAmount: 5000,
      scope: { type: "product", targetIds: [U1, U2] },
      applyToDiscountedItems: true,
      startsAt: null,
      endsAt: null,
      usageLimitTotal: 10,
      usageLimitPerUser: null,
      isActive: false,
      createdAt: "",
    });
    expect(f.idsText).toBe(`${U1}\n${U2}`);
    expect(f.targetIds).toEqual([]);
    expect(f.minOrder).toBe("5000");
    expect(f.usagePerUser).toBe("");
    expect(f.isActive).toBe(false);
  });
});
