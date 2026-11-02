import { api, type CursorMeta, type Page } from "@/lib/api";
import type { ProductDto } from "./dto";
import { toProduct } from "./mappers";
import type { Product } from "./types";

export type ProductListParams = {
  cursor?: string;
  limit?: number;
  category?: string;
  q?: string;
};

/** ☐ مسیر و نام پارامترها با Swagger بک‌اند تطبیق داده شود. */
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
