import { isTerminal, type PaymentInfo } from "./types";

export const RESULT_STATUSES = ["paid", "pending", "failed", "invalid"] as const;
export type ResultStatus = (typeof RESULT_STATUSES)[number];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const idOrNull = (v: string | null): string | null => (v && UUID.test(v) ? v : null);

export type ResultParams = {
  status: ResultStatus;
  orderId: string | null;
  paymentId: string | null;
};

/**
 * پارامترهای برگشت از درگاه (از بک‌اند). این‌ها مدرک پرداخت نیستند؛
 * فقط برای تشخیص «نامعتبر» و پیدا کردن شناسه‌ها به کار می‌روند و نتیجه از GET /payments/:id می‌آید.
 */
export function parseResultParams(get: (key: string) => string | null): ResultParams {
  const raw = get("status");
  const status = (RESULT_STATUSES as readonly (string | null)[]).includes(raw)
    ? (raw as ResultStatus)
    : "invalid";
  const paymentId = idOrNull(get("paymentId"));
  return {
    status: !paymentId ? "invalid" : status,
    orderId: idOrNull(get("orderId")),
    paymentId,
  };
}

export type ResultState =
  | { kind: "verifying" }
  | { kind: "waiting" }
  | { kind: "paid"; payment: PaymentInfo }
  | { kind: "failed"; payment: PaymentInfo }
  | { kind: "timeout"; payment: PaymentInfo }
  | { kind: "invalid" }
  | { kind: "error"; message: string };

export const POLL_MS = 3000;
export const MAX_ATTEMPTS = 15;

/** نتیجه‌ی یک بار بررسی: نهایی، یا باید دوباره پرسید، یا زمان تمام شده. */
export function nextStep(payment: PaymentInfo, attempt: number): ResultState {
  if (payment.status === "paid") return { kind: "paid", payment };
  if (isTerminal(payment.status)) return { kind: "failed", payment };
  return attempt + 1 >= MAX_ATTEMPTS ? { kind: "timeout", payment } : { kind: "waiting" };
}
