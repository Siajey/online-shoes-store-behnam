import type { AdminPaymentDto, PaymentStatusDto } from "./dto";
import { toPaymentStatus, type AdminPayment, type PaymentInfo } from "./types";

export const toPaymentInfo = (dto: PaymentStatusDto): PaymentInfo => ({
  id: dto.paymentId,
  orderId: dto.orderId,
  status: toPaymentStatus(dto.status),
  amount: dto.amount,
  currency: dto.currency,
  paidAt: dto.paidAt,
});

export const toAdminPayment = (dto: AdminPaymentDto): AdminPayment => ({
  ...toPaymentInfo(dto),
  gateway: dto.gateway,
  reference: dto.reference,
  trackingCode: dto.trackingCode,
  cardMask: dto.cardMask,
  failureReason: dto.failureReason,
  orderConfirmedAt: dto.orderConfirmedAt,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
