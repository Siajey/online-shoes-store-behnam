import { isApiRequestError } from "@/lib/api/errors";
import { paymentsCopy as t } from "./copy";
import { PaymentRedirectError } from "./redirect";

const CODE_MESSAGES: Record<string, string> = {
  PAYMENT_GATEWAY_FAILED: t.errors.gatewayFailed,
  PAYMENT_GATEWAY_NOT_SUPPORTED: t.errors.gatewayNotSupported,
  PAYMENT_NOT_FOUND: t.errors.notFound,
  ORDER_NOT_PAYABLE: t.errors.notPayable,
};

/** پیام فارسی برای خطاهای پرداخت؛ به کد خطا تکیه می‌کند، نه متن پیام سرور. */
export function paymentMessage(e: unknown, fallback: string = t.errors.generic): string {
  if (e instanceof PaymentRedirectError) return t.errors.gatewayFailed;
  const code = isApiRequestError(e) ? e.code : null;
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];
  return isApiRequestError(e) && e.message ? e.message : fallback;
}
