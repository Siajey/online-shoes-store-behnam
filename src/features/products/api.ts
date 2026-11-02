import { api, type CursorMeta, type Page } from "@/lib/api";
import type { ProductDto } from "./dto";
import { toProduct } from "./mappers";
import type { Product } from "./types";

export type ProductListParams = {
  cursor?: string;
  limit?: number;
  /** ☐ نام پارامتر فیلتر دسته‌بندی (فعلاً slug دسته) با Swagger تطبیق داده شود */
  category?: string;
  q?: string;
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
