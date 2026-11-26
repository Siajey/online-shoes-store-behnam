import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { paymentsCopy as t } from "../copy";
import type { ResultState } from "../result";
import type { PaymentInfo } from "../types";
import { PaymentResultView } from "./payment-result-view";

const ORDER = "550e8400-e29b-41d4-a716-446655440000";
const payment: PaymentInfo = {
  id: "p1",
  orderId: ORDER,
  status: "paid",
  amount: 2500000,
  currency: "IRT",
  paidAt: null,
};
const noop = () => {};
const html = (
  state: ResultState,
  extra: { orderId?: string | null; paying?: boolean; payError?: string } = {},
) =>
  renderToStaticMarkup(
    <PaymentResultView
      state={state}
      orderId={extra.orderId === undefined ? ORDER : extra.orderId}
      onRecheck={noop}
      onPayAgain={noop}
      paying={extra.paying ?? false}
      payError={extra.payError}
    />,
  );

describe("PaymentResultView", () => {
  it("در حال بررسی: پیام انتظار", () => {
    expect(html({ kind: "verifying" })).toContain(t.result.verifying);
    expect(html({ kind: "waiting" })).toContain(t.result.verifying);
  });
  it("موفق: مبلغ و لینک سفارش و ادامه‌ی خرید", () => {
    const out = html({ kind: "paid", payment });
    expect(out).toContain(t.result.paid.title);
    expect(out).toContain(`href="/account/orders/${ORDER}"`);
    expect(out).toContain('href="/products"');
    expect(out).toMatch(/۲.{0,2}۵۰۰.{0,2}۰۰۰/);
  });
  it("ناموفق: دکمه‌ی پرداخت دوباره (فقط با orderId)", () => {
    expect(html({ kind: "failed", payment })).toContain(t.result.payAgain);
    expect(html({ kind: "failed", payment }, { orderId: null })).not.toContain(t.result.payAgain);
  });
  it("ناموفق: هنگام انتقال دکمه غیرفعال است و خطا نمایش داده می‌شود", () => {
    const out = html({ kind: "failed", payment }, { paying: true, payError: "خطای درگاه" });
    expect(out).toContain('disabled=""');
    expect(out).toContain(t.result.redirecting);
    expect(out).toContain("خطای درگاه");
  });
  it("زمان تمام شد: بررسی دوباره", () => {
    const out = html({ kind: "timeout", payment });
    expect(out).toContain(t.result.timeout.title);
    expect(out).toContain(t.result.recheck);
  });
  it("نامعتبر و خطا", () => {
    expect(html({ kind: "invalid" })).toContain(t.result.invalid.title);
    const err = html({ kind: "error", message: "بررسی نشد" });
    expect(err).toContain("بررسی نشد");
    expect(err).toContain(t.result.retry);
  });
});
