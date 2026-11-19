import { api } from "@/lib/api";
import { tomanToRial } from "@/lib/money";
import type { OrderDetailDto, OrderListDto } from "./dto";
import { toOrderDetail, toOrderPage } from "./mappers";
import type { OrderDetail, OrderPage, OrderStatus, OrderStatusAction } from "./types";

/** بک‌اند CSRF را روی همه‌ی درخواست‌های سفارش می‌خواهد (GET هم، مثل سبد). */
const withCsrf = { csrf: true } as const;

export const ORDERS_PAGE_SIZE = 10;

/**
 * ثبت سفارش از روی سبد فعلی. ردیف‌ها و قیمت‌ها را سرور حساب می‌کند.
 * idempotencyKey (۸ تا ۱۰۰ نویسه): تکرار با همان کلید، همان سفارش را برمی‌گرداند.
 * expectedTotal (تومان): اختیاری؛ اگر مبلغ فرق کند سرور ORDER_PRICE_CHANGED می‌دهد.
 */
export async function placeOrder(input: {
  addressId: string;
  idempotencyKey: string;
  expectedTotal?: number;
}): Promise<OrderDetail> {
  const body: { addressId: string; expectedTotal?: number } = { addressId: input.addressId };
  if (input.expectedTotal !== undefined) body.expectedTotal = tomanToRial(input.expectedTotal);
  const { data } = await api.post<OrderDetailDto>("/orders", {
    ...withCsrf,
    body,
    headers: { "idempotency-key": input.idempotencyKey },
  });
  return toOrderDetail(data);
}

const pageQuery = (
  cursor?: string | null,
  extra: Record<string, string | number | undefined> = {},
) => {
  const q = new URLSearchParams({ pageSize: String(ORDERS_PAGE_SIZE) });
  if (cursor) q.set("nextCursor", cursor);
  for (const [k, v] of Object.entries(extra)) if (v !== undefined && v !== "") q.set(k, String(v));
  return `?${q.toString()}`;
};

export async function listOrders(cursor?: string | null): Promise<OrderPage> {
  const { data } = await api.get<OrderListDto>(`/orders${pageQuery(cursor)}`, withCsrf);
  return toOrderPage(data);
}

export async function getOrder(id: string): Promise<OrderDetail> {
  const { data } = await api.get<OrderDetailDto>(`/orders/${encodeURIComponent(id)}`, withCsrf);
  return toOrderDetail(data);
}

export async function cancelOrder(id: string): Promise<OrderDetail> {
  const { data } = await api.post<OrderDetailDto>(`/orders/${encodeURIComponent(id)}/cancel`, {
    ...withCsrf,
    body: {},
  });
  return toOrderDetail(data);
}

/* ───── ادمین (فعلاً فقط لایه‌ی API؛ صفحه‌ی ادمین بعداً ساخته می‌شود) ───── */

export type AdminOrdersQuery = {
  cursor?: string | null;
  statuses?: readonly OrderStatus[];
  from?: string;
  to?: string;
  orderNumber?: number;
};

export async function adminListOrders(q: AdminOrdersQuery = {}): Promise<OrderPage> {
  const qs = pageQuery(q.cursor, {
    statuses: q.statuses?.join(","),
    from: q.from,
    to: q.to,
    orderNumber: q.orderNumber,
  });
  const { data } = await api.get<OrderListDto>(`/admin/orders${qs}`, withCsrf);
  return toOrderPage(data);
}

export async function adminGetOrder(id: string): Promise<OrderDetail> {
  const { data } = await api.get<OrderDetailDto>(
    `/admin/orders/${encodeURIComponent(id)}`,
    withCsrf,
  );
  return toOrderDetail(data);
}

export async function adminUpdateOrderStatus(
  id: string,
  action: OrderStatusAction,
): Promise<OrderDetail> {
  const { data } = await api.post<OrderDetailDto>(
    `/admin/orders/${encodeURIComponent(id)}/status`,
    {
      ...withCsrf,
      body: action,
    },
  );
  return toOrderDetail(data);
}
