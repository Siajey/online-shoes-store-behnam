import { api, type CursorMeta, type Page } from "@/lib/api";
import { isApiRequestError } from "@/lib/api/errors";
import type { ProductDto } from "./dto";
import { toProduct } from "./mappers";
import type { Product } from "./types";

export type ProductListParams = {
  cursor?: string;
  limit?: number;
  /** ☐ نام پارامتر فیلتر دسته‌بندی (فعلاً slug دسته) با Swagger تطبیق داده شود */
  category?: string;
  q?: string;
  /** ☐ نام و مقدارهای مرتب‌سازی و فیلتر قیمت/موجودی با Swagger تطبیق داده شود */
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
};

export async function fetchProducts(
  params: ProductListParams = {},
  signal?: AbortSignal,
): Promise<Page<Product>> {
  const res = await api.get<ProductDto[], CursorMeta>("/products", { query: params, signal });
  return {
    items: res.data.map(toProduct),
    nextCursor: res.meta?.nextCursor ?? null,
  };
}

/**
 * یک محصول با slug. اگر پیدا نشود (۴۰۴) null برمی‌گرداند.
 * ☐ مسیر GET /products/{slug} و شکل پاسخ (فعلاً هم‌شکل آیتم لیست) با Swagger تأیید شود.
 */
export async function fetchProduct(slug: string, signal?: AbortSignal): Promise<Product | null> {
  try {
    const res = await api.get<ProductDto>(`/products/${encodeURIComponent(slug)}`, { signal });
    return toProduct(res.data);
  } catch (error) {
    if (isApiRequestError(error) && error.status === 404) return null;
    throw error;
  }
}
