import { api } from "@/lib/api";
import { toProductDetail, type AdminProductDetail, type AdminProductDetailDto } from "./detail";
import type { ProductPayload } from "./form";
import { toStatus } from "./mappers";

const map = (dto: AdminProductDetailDto) => toProductDetail(dto, toStatus);

export async function fetchAdminProduct(
  id: string,
  signal?: AbortSignal,
): Promise<AdminProductDetail> {
  // همه‌ی endpointهای /admin حتی GET هم CSRFGuard دارند.
  const res = await api.get<AdminProductDetailDto>(`/admin/products/${encodeURIComponent(id)}`, {
    signal,
    csrf: true,
  });
  return map(res.data);
}

export async function createProduct(payload: ProductPayload): Promise<AdminProductDetail> {
  const res = await api.post<AdminProductDetailDto>("/admin/products", {
    body: { type: "shoe", ...payload },
  });
  return map(res.data);
}

/** slug فقط وقتی فرستاده می‌شود که تغییر کرده باشد (بعد از انتشار، تغییرش خطا می‌دهد). */
export async function updateProduct(
  id: string,
  payload: ProductPayload,
  current: Pick<AdminProductDetail, "slug" | "slugLocked">,
): Promise<AdminProductDetail> {
  const { gender, material, slug, ...rest } = payload;
  const body = {
    ...rest,
    ...(!current.slugLocked && slug !== current.slug ? { slug } : {}),
    shoe: { gender, material },
  };
  const res = await api.patch<AdminProductDetailDto>(`/admin/products/${encodeURIComponent(id)}`, {
    body,
  });
  return map(res.data);
}
