import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { adminOrderPayments, beginPayment, fetchPayment, startPayment } from "./api";
import { PaymentRedirectError } from "./redirect";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn() } }));

const ID = "7a7f2c10-8d3b-4e8f-a9d1-123456789abc";
const ORDER = "550e8400-e29b-41d4-a716-446655440000";

beforeEach(() => {
  vi.mocked(api.get).mockReset();
  vi.mocked(api.post).mockReset();
});

describe("startPayment", () => {
  it("فقط orderId را با CSRF می‌فرستد (مبلغ را فرانت نمی‌فرستد)", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { paymentId: ID, redirectUrl: "https://gw.test/x" },
    } as never);
    expect(await startPayment(ORDER)).toEqual({ paymentId: ID, redirectUrl: "https://gw.test/x" });
    const [path, opts] = vi.mocked(api.post).mock.calls[0] as unknown as [
      string,
      { csrf: boolean; body: unknown },
    ];
    expect(path).toBe("/payments");
    expect(opts.csrf).toBe(true);
    expect(opts.body).toEqual({ orderId: ORDER });
  });
});

describe("beginPayment", () => {
  it("به آدرس https درگاه می‌رود", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { paymentId: ID, redirectUrl: "https://gw.test/pay?t=1" },
    } as never);
    const navigate = vi.fn();
    await beginPayment(ORDER, navigate);
    expect(navigate).toHaveBeenCalledWith("https://gw.test/pay?t=1");
  });
  it.each(["http://gw.test/x", "javascript:alert(1)", "not a url", ""])(
    "آدرس ناامن %s رد می‌شود",
    async (bad) => {
      vi.mocked(api.post).mockResolvedValue({ data: { paymentId: ID, redirectUrl: bad } } as never);
      const navigate = vi.fn();
      await expect(beginPayment(ORDER, navigate)).rejects.toBeInstanceOf(PaymentRedirectError);
      expect(navigate).not.toHaveBeenCalled();
    },
  );
});

describe("fetchPayment", () => {
  it("پاسخ را به مدل فرانت تبدیل می‌کند و مبلغ تومان می‌ماند", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        paymentId: ID,
        orderId: ORDER,
        status: "paid",
        amount: 2500000,
        currency: "IRT",
        paidAt: "2026-11-23T18:30:00.000Z",
      },
    } as never);
    const p = await fetchPayment(ID);
    expect(p).toEqual({
      id: ID,
      orderId: ORDER,
      status: "paid",
      amount: 2500000,
      currency: "IRT",
      paidAt: "2026-11-23T18:30:00.000Z",
    });
    expect(vi.mocked(api.get).mock.calls[0][0]).toBe(`/payments/${ID}`);
  });
  it("وضعیت ناشناس غیرنهایی حساب می‌شود", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        paymentId: ID,
        orderId: ORDER,
        status: "weird",
        amount: 1,
        currency: "IRT",
        paidAt: null,
      },
    } as never);
    expect((await fetchPayment(ID)).status).toBe("initiated");
  });
});

describe("adminOrderPayments", () => {
  it("فهرست پرداخت‌های سفارش را می‌گیرد", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        items: [
          {
            paymentId: ID,
            orderId: ORDER,
            status: "failed",
            amount: 5,
            currency: "IRT",
            paidAt: null,
            gateway: "zibal",
            reference: null,
            trackingCode: null,
            cardMask: null,
            failureReason: "x",
            orderConfirmedAt: null,
            createdAt: "2026-11-23T18:29:00.000Z",
            updatedAt: "2026-11-23T18:30:00.000Z",
          },
        ],
      },
    } as never);
    const items = await adminOrderPayments(ORDER);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: ID,
      status: "failed",
      gateway: "zibal",
      failureReason: "x",
    });
    expect(vi.mocked(api.get).mock.calls[0][0]).toBe(`/admin/orders/${ORDER}/payments`);
  });
});
