import { api, type Page } from "@/lib/api";
import type { AdminProductStatusDto, AdminProductsPageDto } from "./dto";
import { toAdminProduct, toStatus } from "./mappers";
import type { AdminProduct, ProductStatus, StatusAction } from "./types";

export type AdminListParams = {
  status?: ProductStatus;
  q?: string;
  cursor?: string;
  limit?: number;
};

export async function fetchAdminProducts(
  params: AdminListParams = {},
  signal?: AbortSignal,
): Promise<Page<AdminProduct>> {
  const res = await api.get<AdminProductsPageDto>("/admin/products", {
    query: {
      statuses: params.status,
      q: params.q?.trim() || undefined,
      nextCursor: params.cursor,
      pageSize: params.limit,
    },
    signal,
  });
  return { items: res.data.items.map(toAdminProduct), nextCursor: res.data.nextCursor ?? null };
}

/** وضعیت جدید محصول را از پاسخ سرور برمی‌گرداند. */
export async function changeProductStatus(
  id: string,
  action: StatusAction,
): Promise<ProductStatus> {
  const res = await api.post<AdminProductStatusDto>(
    `/admin/products/${encodeURIComponent(id)}/${action}`,
  );
  return toStatus(res.data.status);
}
