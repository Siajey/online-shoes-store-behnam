import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ordersCopy as t } from "../copy";
import type { OrderDetail } from "../types";
import { OrderDetailView } from "./order-detail-view";

const order: OrderDetail = {
  id: "o1",
  orderNumber: 1001,
  status: "pending_payment",
  itemCount: 1,
  total: 1000000,
  createdAt: "2026-11-16T10:30:00.000Z",
  paidAt: null,
  totals: {
    subtotal: 1000000,
    productDiscountTotal: 0,
    couponDiscount: 0,
    shippingFee: 0,
    total: 1000000,
  },
  couponCode: null,
  lines: [],
  address: { province: "تهران", city: "تهران", street: "آزادی", postalCode: "1234567890" },
  recipient: { name: "علی رضایی", phone: "09120000000" },
  carrier: null,
  trackingCode: null,
  canPay: true,
  expiresAt: "2026-11-16T11:00:00.000Z",
  timeline: [],
};
const noop = () => {};
const html = (
  o: OrderDetail,
  extra: {
    onPay?: () => void;
    paying?: boolean;
    payError?: string | null;
    payNotice?: boolean;
  } = {},
) =>
  renderToStaticMarkup(
    <OrderDetailView
      order={o}
      cancelling={false}
      confirmingCancel={false}
      actionError={null}
      onAskCancel={noop}
      onAbortCancel={noop}
      onConfirmCancel={noop}
      onRefresh={noop}
      {...extra}
    />,
  );

describe("OrderDetailView پرداخت", () => {
  it("سفارش قابل پرداخت: دکمه‌ی پرداخت فعال است", () => {
    const out = html(order, { onPay: noop });
    expect(out).toContain(t.payNow);
    expect(out).not.toContain('disabled=""');
  });
  it("هنگام انتقال، دکمه غیرفعال است", () => {
    const out = html(order, { onPay: noop, paying: true });
    expect(out).toContain(t.payRedirecting);
    expect(out).toContain('disabled=""');
  });
  it("سفارش غیرقابل پرداخت: دکمه غیرفعال و توضیح نمایش داده می‌شود", () => {
    const out = html({ ...order, canPay: false }, { onPay: noop });
    expect(out).toContain('disabled=""');
    expect(out).toContain(t.cannotPay);
  });
  it("خطای شروع پرداخت و پیام اتصال ناموفق", () => {
    const out = html(order, { onPay: noop, payError: "خطای درگاه", payNotice: true });
    expect(out).toContain("خطای درگاه");
    expect(out).toContain(t.payFailedNotice);
  });
  it("سفارش پرداخت‌شده بخش پرداخت ندارد", () => {
    expect(html({ ...order, status: "paid" }, { onPay: noop })).not.toContain(t.payNow);
  });
});
