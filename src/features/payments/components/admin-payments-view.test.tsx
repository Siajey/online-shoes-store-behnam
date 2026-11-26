import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { paymentsCopy as t } from "../copy";
import type { AdminPayment } from "../types";
import { AdminPaymentsView, type AdminPaymentsState } from "./admin-payments-view";

const item = (over: Partial<AdminPayment> = {}): AdminPayment => ({
  id: "p1",
  orderId: "o1",
  status: "paid",
  amount: 2500000,
  currency: "IRT",
  paidAt: "2026-11-23T18:30:00.000Z",
  gateway: "zibal",
  reference: "123",
  trackingCode: "987654321",
  cardMask: "6219********1234",
  failureReason: null,
  orderConfirmedAt: null,
  createdAt: "2026-11-23T18:29:00.000Z",
  updatedAt: "2026-11-23T18:30:02.000Z",
  ...over,
});
const html = (state: AdminPaymentsState) =>
  renderToStaticMarkup(<AdminPaymentsView state={state} onRetry={() => {}} />);

describe("AdminPaymentsView", () => {
  it("بارگذاری، خطا و خالی", () => {
    expect(html({ status: "loading" })).toContain(t.admin.loading);
    const err = html({ status: "error", message: "خطا" });
    expect(err).toContain("خطا");
    expect(err).toContain(t.admin.retry);
    expect(html({ status: "ready", items: [] })).toContain(t.admin.empty);
  });
  it("پرداخت موفق: وضعیت، کد پیگیری، کارت و وضعیت تأیید سفارش", () => {
    const out = html({ status: "ready", items: [item()] });
    expect(out).toContain(t.status.paid);
    expect(out).toContain("987654321");
    expect(out).toContain("6219********1234");
    expect(out).toContain(t.admin.notConfirmed);
  });
  it("پرداخت ناموفق: دلیل نمایش داده می‌شود", () => {
    const out = html({
      status: "ready",
      items: [item({ status: "failed", paidAt: null, failureReason: "gateway_request_failed" })],
    });
    expect(out).toContain(t.status.failed);
    expect(out).toContain("gateway_request_failed");
  });
});
