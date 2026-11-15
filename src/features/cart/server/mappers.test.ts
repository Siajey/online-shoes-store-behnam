import { describe, expect, it } from "vitest";
import type { CartDto, CartLineDto } from "./dto";
import { REMOVED_PRODUCT_NAME, toCartItem, toServerCart } from "./mappers";

const line = (over: Partial<CartLineDto> = {}): CartLineDto => ({
  variantId: "v1",
  quantity: 2,
  available: true,
  unavailableReason: null,
  maxQuantity: 5,
  product: { id: "p1", name: "ایر مکس", slug: "air-max", imageKey: null },
  attributes: [
    { name: "size", value: "42" },
    { name: "color", value: "مشکی" },
  ],
  originalUnitPrice: 20_000_000,
  unitPrice: 18_000_000,
  lineTotal: 36_000_000,
  ...over,
});

describe("toCartItem", () => {
  it("ریال را به تومان و ویژگی‌ها را به برچسب فارسی تبدیل می‌کند", () => {
    expect(toCartItem(line())).toMatchObject({
      id: "p1:v1",
      productId: "p1",
      variantId: "v1",
      slug: "air-max",
      name: "ایر مکس",
      price: 1_800_000,
      originalPrice: 2_000_000,
      quantity: 2,
      maxQuantity: 5,
      variantLabel: "سایز ۴۲، رنگ مشکی",
    });
  });

  it("بدون تخفیف originalPrice ندارد", () => {
    const item = toCartItem(line({ originalUnitPrice: 18_000_000 }));
    expect(item.originalPrice).toBeUndefined();
  });

  it("ردیف ناموجود دلیلش را نگه می‌دارد", () => {
    const item = toCartItem(line({ available: false, unavailableReason: "outOfStock" }));
    expect(item.unavailable).toBe("outOfStock");
  });

  it("ترکیب حذف‌شده: بدون محصول و قیمت، با نام جایگزین و بدون slug", () => {
    const item = toCartItem(
      line({
        product: null,
        attributes: [],
        unitPrice: null,
        originalUnitPrice: null,
        lineTotal: null,
        maxQuantity: 0,
        available: false,
        unavailableReason: "variantUnavailable",
      }),
    );
    expect(item).toMatchObject({
      name: REMOVED_PRODUCT_NAME,
      slug: "",
      price: 0,
      unavailable: "variantUnavailable",
      maxQuantity: 0,
    });
    expect(item.variantLabel).toBeUndefined();
  });
});

describe("toServerCart", () => {
  it("ردیف‌ها و نشانه‌ی ناموجودی را می‌آورد", () => {
    const dto: CartDto = {
      items: [line()],
      coupon: { code: null, status: "none" },
      totals: { itemCount: 2, subtotal: 0, productDiscountTotal: 0, couponDiscount: 0, total: 0 },
      hasUnavailableLines: true,
    };
    const cart = toServerCart(dto);
    expect(cart.items).toHaveLength(1);
    expect(cart.hasUnavailable).toBe(true);
  });
});

describe("کد تخفیف در سبد", () => {
  const cart = (over = {}): CartDto => ({
    items: [line()],
    coupon: { code: null, status: "none" },
    totals: {
      itemCount: 2,
      subtotal: 40_000_000,
      productDiscountTotal: 4_000_000,
      couponDiscount: 0,
      total: 36_000_000,
    },
    hasUnavailableLines: false,
    ...over,
  });
  it("بدون کد: none و تخفیف صفر", () => {
    const c = toServerCart(cart());
    expect(c.coupon).toEqual({ code: null, status: "none", invalidReason: null });
    expect(c.couponDiscount).toBe(0);
  });
  it("کد اعمال‌شده: تخفیف از ریال به تومان", () => {
    const c = toServerCart(
      cart({
        coupon: { code: "SUMMER20", status: "applied", invalidReason: null },
        totals: {
          itemCount: 2,
          subtotal: 0,
          productDiscountTotal: 0,
          couponDiscount: 2_000_000,
          total: 0,
        },
      }),
    );
    expect(c.coupon.code).toBe("SUMMER20");
    expect(c.couponDiscount).toBe(200_000);
  });
  it("کد نامعتبر: دلیل نگه داشته می‌شود", () => {
    const c = toServerCart(
      cart({ coupon: { code: "OLD", status: "invalid", invalidReason: "expired" } }),
    );
    expect(c.coupon.invalidReason).toBe("expired");
  });
});
