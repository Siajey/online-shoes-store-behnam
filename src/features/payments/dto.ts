/** شکل پاسخ API پرداخت بک‌اند (مبلغ‌ها به تومان). فقط mapper و api این‌ها را می‌خواند. */
export type StartPaymentDto = { paymentId: string; redirectUrl: string };

export type PaymentStatusDto = {
  paymentId: string;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  paidAt: string | null;
};

export type AdminPaymentDto = PaymentStatusDto & {
  gateway: string;
  reference: string | null;
  trackingCode: string | null;
  cardMask: string | null;
  failureReason: string | null;
  orderConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
