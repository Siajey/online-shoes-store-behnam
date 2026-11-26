import { describe, expect, it } from "vitest";
import { MAX_ATTEMPTS, nextStep, parseResultParams } from "./result";
import type { PaymentInfo } from "./types";

const ID = "7a7f2c10-8d3b-4e8f-a9d1-123456789abc";
const ORDER = "550e8400-e29b-41d4-a716-446655440000";
const q = (o: Record<string, string>) => (k: string) => o[k] ?? null;
const pay = (status: PaymentInfo["status"]): PaymentInfo => ({
  id: ID,
  orderId: ORDER,
  status,
  amount: 10,
  currency: "IRT",
  paidAt: null,
});

describe("parseResultParams", () => {
  it("پارامترهای معتبر را برمی‌گرداند", () => {
    expect(parseResultParams(q({ status: "paid", orderId: ORDER, paymentId: ID }))).toEqual({
      status: "paid",
      orderId: ORDER,
      paymentId: ID,
    });
  });
  it("بدون paymentId یا با وضعیت ناشناس، نامعتبر است", () => {
    expect(parseResultParams(q({ status: "paid" })).status).toBe("invalid");
    expect(parseResultParams(q({ status: "hacked", paymentId: ID })).status).toBe("invalid");
    expect(parseResultParams(q({})).status).toBe("invalid");
  });
  it("شناسه‌ی غیر UUID حذف می‌شود", () => {
    const p = parseResultParams(q({ status: "pending", orderId: "../x", paymentId: ID }));
    expect(p.orderId).toBeNull();
    expect(p.status).toBe("pending");
  });
});

describe("nextStep", () => {
  it("paid نهایی است", () => {
    expect(nextStep(pay("paid"), 0).kind).toBe("paid");
  });
  it("failed و expired ناموفق‌اند", () => {
    expect(nextStep(pay("failed"), 0).kind).toBe("failed");
    expect(nextStep(pay("expired"), 0).kind).toBe("failed");
  });
  it("غیرنهایی منتظر می‌ماند و بعد از مهلت timeout می‌شود", () => {
    expect(nextStep(pay("redirected"), 0).kind).toBe("waiting");
    expect(nextStep(pay("initiated"), MAX_ATTEMPTS - 1).kind).toBe("timeout");
  });
});
