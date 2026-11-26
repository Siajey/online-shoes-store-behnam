import { api } from "@/lib/api";
import type { AdminPaymentDto, PaymentStatusDto, StartPaymentDto } from "./dto";
import { toAdminPayment, toPaymentInfo } from "./mappers";
import { PaymentRedirectError, safeGatewayUrl } from "./redirect";
import type { AdminPayment, PaymentInfo, StartPaymentResult } from "./types";

/**
 * شروع پرداخت برای سفارشی که ثبت شده. مبلغ را سرور حساب می‌کند و فرانت هیچ مبلغی نمی‌فرستد.
 * درگاه پیش‌فرض بک‌اند استفاده می‌شود.
 */
export async function startPayment(orderId: string): Promise<StartPaymentResult> {
  const { data } = await api.post<StartPaymentDto>("/payments", { csrf: true, body: { orderId } });
  return { paymentId: data.paymentId, redirectUrl: data.redirectUrl };
}

/** وضعیت یک پرداخت خود کاربر. (بک‌اند برای این GET نیازی به CSRF ندارد.) */
export async function fetchPayment(id: string): Promise<PaymentInfo> {
  const { data } = await api.get<PaymentStatusDto>(`/payments/${encodeURIComponent(id)}`);
  return toPaymentInfo(data);
}

export async function adminOrderPayments(orderId: string): Promise<AdminPayment[]> {
  const { data } = await api.get<{ items: AdminPaymentDto[] }>(
    `/admin/orders/${encodeURIComponent(orderId)}/payments`,
    { csrf: true },
  );
  return data.items.map(toAdminPayment);
}

/**
 * پرداخت را شروع می‌کند و مرورگر را به درگاه می‌برد. فقط آدرس https قبول می‌شود.
 * navigate برای تست قابل تعویض است.
 */
export async function beginPayment(
  orderId: string,
  navigate: (url: string) => void = (url) => window.location.assign(url),
): Promise<StartPaymentResult> {
  const result = await startPayment(orderId);
  const url = safeGatewayUrl(result.redirectUrl);
  if (!url) throw new PaymentRedirectError();
  navigate(url);
  return result;
}
