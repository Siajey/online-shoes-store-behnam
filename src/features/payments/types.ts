export type PaymentStatus = "initiated" | "redirected" | "paid" | "failed" | "expired";

const STATUSES: readonly PaymentStatus[] = ["initiated", "redirected", "paid", "failed", "expired"];

/** وضعیت ناشناس غیرنهایی حساب می‌شود تا صفحه‌ی نتیجه با وضعیت جدید سرور نشکند. */
export const toPaymentStatus = (raw: string): PaymentStatus =>
  (STATUSES as readonly string[]).includes(raw) ? (raw as PaymentStatus) : "initiated";

export const isTerminal = (s: PaymentStatus): boolean =>
  s === "paid" || s === "failed" || s === "expired";
/** مبلغ به تومان. */
/** مبلغ به تومان (بک‌اند پرداخت تومان می‌دهد؛ تبدیل ریال/تومان سفارش‌ها اینجا اعمال نمی‌شود). */
export type PaymentInfo = {
  id: string;
  orderId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt: string | null;
};

export type AdminPayment = PaymentInfo & {
  gateway: string;
  reference: string | null;
  trackingCode: string | null;
  cardMask: string | null;
  failureReason: string | null;
  orderConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StartPaymentResult = { paymentId: string; redirectUrl: string };
