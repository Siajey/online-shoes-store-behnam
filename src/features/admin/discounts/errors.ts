import { isApiRequestError } from "@/lib/api/errors";
import { offerCopy as t } from "./copy";

/** پیام کاربرپسند بر اساس code خطای بک‌اند؛ برای بقیه، پیام خود سرور. */
export function offerErrorMessage(e: unknown, fallback: string = t.actionError): string {
  if (!isApiRequestError(e)) return fallback;
  if (e.code === "COUPON_HAS_REDEMPTIONS") return t.hasRedemptions;
  return e.message || fallback;
}

export const isDuplicateCode = (e: unknown) =>
  isApiRequestError(e) && e.code === "COUPON_CODE_ALREADY_EXISTS";
