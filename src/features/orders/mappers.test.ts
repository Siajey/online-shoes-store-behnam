import { describe, expect, it } from "vitest";
import type { OrderDetailDto } from "./dto";
import { toOrderDetail, toOrderPage } from "./mappers";
import { canCancel } from "./status";

const dto: OrderDetailDto = {
  id: "o1",
  orderNumber: 1001,
  status: "pending_payment",
  itemCount: 2,
  total: 12500000,
  currency: "IRR",
  previewImageKey: null,
  createdAt: "2026-11-16T10:30:00.000Z",
  paidAt: null,
  totals: {
    subtotal: 14000000,
    productDiscountTotal: 1000000,
    couponDiscount: 1000000,
    shippingFee: 500000,
    total: 12500000,
  },
  coupon: { code: "WELCOME" },
  lines: [
    {
      variantId: "v1",
      productId: "p1",
      productName: "کفش",
      productSlug: "shoe",
      imageKey: null,
      attributes: [
        { name: "رنگ", value: "مشکی" },
        { name: "سایز", value: 42 },
      ],
      quantity: 2,
      originalUnitPrice: 7000000,
      unitPrice: 6500000,
      couponAllocation: 500000,
      lineTotal: 12500000,
    },
  ],
  shippingAddress: { province: "تهران", city: "تهران", street: "آزادی", postalCode: "1234567890" },
  recipient: { firstName: "علی", lastName: "رضایی", phoneNumber: "09120000000" },
  shipment: { carrier: null, trackingCode: null },
  canPay: true,
  expiresAt: "2026-11-16T11:00:00.000Z",
  timeline: [{ status: "pending_payment", note: null, at: "2026-11-16T10:30:00.000Z" }],
};

describe("orders mappers", () => {
  it("مبلغ‌ها را از ریال به تومان برمی‌گرداند", () => {
    const o = toOrderDetail(dto);
    expect(o.total).toBe(1250000);
    expect(o.totals.shippingFee).toBe(50000);
    expect(o.lines[0]?.unitPrice).toBe(650000);
    expect(o.lines[0]?.variantLabel).toBe("مشکی · 42");
    expect(o.couponCode).toBe("WELCOME");
    expect(o.recipient.name).toBe("علی رضایی");
  });

  it("صفحه‌ی لیست و نشانگر بعدی", () => {
    const page = toOrderPage({ items: [{ ...dto, recipient: "علی رضایی" }], nextCursor: null });
    expect(page.items[0]?.total).toBe(1250000);
    expect(page.nextCursor).toBeNull();
  });

  it("فقط در انتظار پرداخت قابل لغو است", () => {
    expect(canCancel("pending_payment")).toBe(true);
    expect(canCancel("paid")).toBe(false);
  });

  it("imageUrl سرور بر ساخت از کلید اولویت دارد", () => {
    const withUrl: OrderDetailDto = {
      ...dto,
      previewImageUrl: "https://img.test/p.webp",
      lines: [{ ...dto.lines[0], imageUrl: "https://img.test/l.webp" }],
    };
    const d = toOrderDetail(withUrl);
    expect(d.imageUrl).toBe("https://img.test/p.webp");
    expect(d.lines[0].imageUrl).toBe("https://img.test/l.webp");
  });
});
