import { isApiRequestError } from "@/lib/api/errors";
import { shippingCopy } from "@/features/shipping/copy";
import { ordersCopy as t } from "./copy";

export type PlaceOrderFailure =
  | { kind: "empty" }
  | { kind: "recipient" }
  | { kind: "priceChanged"; message: string }
  | { kind: "couponInvalid"; message: string }
  | { kind: "shipping"; message: string }
  | { kind: "other"; message: string };

const CODE_MESSAGES: Record<string, string> = {
  ORDER_NOT_FOUND: t.errors.notFound,
  ORDER_NOT_PAYABLE: t.errors.notPayable,
  ORDER_INVALID_STATUS_TRANSITION: t.errors.transition,
  ORDER_VERSION_CONFLICT: t.errors.conflict,
};

export const codeOf = (e: unknown): string | null =>
  isApiRequestError(e) ? (e.code ?? null) : null;

export const isNotFound = (e: unknown): boolean => codeOf(e) === "ORDER_NOT_FOUND";

/** پیام فارسی برای خطاهای مدیریت/لغو سفارش؛ به کد خطا تکیه می‌کند، نه متن پیام. */
export function orderMessage(e: unknown, fallback: string): string {
  const code = codeOf(e);
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];
  return isApiRequestError(e) && e.message ? e.message : fallback;
}

export function classifyPlaceOrderError(e: unknown): PlaceOrderFailure {
  switch (codeOf(e)) {
    case "ORDER_EMPTY":
      return { kind: "empty" };
    case "ORDER_RECIPIENT_INCOMPLETE":
      return { kind: "recipient" };
    case "ORDER_PRICE_CHANGED":
      return { kind: "priceChanged", message: t.errors.priceChanged };
    case "ORDER_COUPON_INVALID":
      return { kind: "couponInvalid", message: t.errors.couponInvalid };
    case "SHIPPING_QUOTE_UNAVAILABLE":
    case "SHIPPING_INVALID_METHOD":
    case "SHIPPING_METHOD_NOT_FOUND":
      return { kind: "shipping", message: shippingCopy.errors.methodUnavailable };
    case "SHIPPING_INVALID_DESTINATION":
      return { kind: "shipping", message: shippingCopy.errors.destination };
    default:
      return { kind: "other", message: orderMessage(e, t.errors.placeFailed) };
  }
}

/** این خطاها یعنی درخواست قبلی ثبت نشده یا دیگر معتبر نیست؛ برای تلاش بعدی کلید تازه لازم است. */
export const needsFreshKey = (f: PlaceOrderFailure): boolean => f.kind !== "other";
