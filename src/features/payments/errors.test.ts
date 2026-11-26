import { describe, expect, it, vi } from "vitest";
import { paymentsCopy as t } from "./copy";
import { paymentMessage } from "./errors";
import { PaymentRedirectError, safeGatewayUrl } from "./redirect";

vi.mock("@/lib/api/errors", () => ({
  isApiRequestError: (e: unknown) => Boolean(e && (e as { isApi?: boolean }).isApi),
}));

const apiError = (code: string, message = "server text") => ({ isApi: true, code, message });

describe("paymentMessage", () => {
  it("بر اساس کد خطا پیام فارسی می‌دهد", () => {
    expect(paymentMessage(apiError("PAYMENT_GATEWAY_FAILED"))).toBe(t.errors.gatewayFailed);
    expect(paymentMessage(apiError("PAYMENT_GATEWAY_NOT_SUPPORTED"))).toBe(
      t.errors.gatewayNotSupported,
    );
    expect(paymentMessage(apiError("ORDER_NOT_PAYABLE"))).toBe(t.errors.notPayable);
  });
  it("کد ناشناس: پیام سرور؛ خطای غیر API: پیام عمومی", () => {
    expect(paymentMessage(apiError("OTHER", "متن سرور"))).toBe("متن سرور");
    expect(paymentMessage(new Error("x"))).toBe(t.errors.generic);
  });
  it("ریدایرکت ناامن پیام اتصال درگاه می‌دهد", () => {
    expect(paymentMessage(new PaymentRedirectError())).toBe(t.errors.gatewayFailed);
  });
});

describe("safeGatewayUrl", () => {
  it("فقط https", () => {
    expect(safeGatewayUrl("https://gateway.zibal.ir/start/1")).toBe(
      "https://gateway.zibal.ir/start/1",
    );
    expect(safeGatewayUrl("http://x.test")).toBeNull();
    expect(safeGatewayUrl(undefined)).toBeNull();
  });
});
