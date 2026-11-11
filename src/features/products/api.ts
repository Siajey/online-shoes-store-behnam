import { api, type Page } from "@/lib/api";
import { isApiRequestError } from "@/lib/api/errors";
import { fetchCategories } from "@/features/categories/api";
import type { Category } from "@/features/categories/types";
import type { ProductDetailDto, ProductsPageDto } from "./dto";
import type { ProductSort } from "./filters";
import { toProduct, toProductDetail, type CategoryLookup } from "./mappers";
import type { Product } from "./types";
import { tomanToRial } from "@/lib/money";

export type ProductListParams = {
  cursor?: string;
  limit?: number;
  /** slug دسته‌بندی؛ به شناسه تبدیل می‌شود (زیردسته‌ها را بک‌اند خودش شامل می‌کند) */
  category?: string;
  q?: string;
  sort?: ProductSort;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
};

/** عبارت جستجو در بک‌اند حداقل ۲ نویسه است. */
export const MIN_SEARCH_LENGTH = 2;

/** مرتب‌سازی فرانت به قالب بک‌اند (field:direction). پیش‌فرض: تازه‌ترین. */
const SORT_PARAM: Record<ProductSort, string> = {
  "price-asc": "minPrice:asc",
  "price-desc": "minPrice:desc",
};
const DEFAULT_SORT = "createdAt:desc";

type CategoryIndex = { byId: CategoryLookup; idBySlug: ReadonlyMap<string, string> };

function indexCategories(tree: readonly Category[]): CategoryIndex {
  const byId = new Map<string, { name: string; slug: string }>();
  const idBySlug = new Map<string, string>();
  const walk = (nodes: readonly Category[]) => {
    for (const c of nodes) {
      byId.set(c.id, { name: c.name, slug: c.slug });
      idBySlug.set(c.slug, c.id);
      walk(c.children);
    }
  };
  walk(tree);
  return { byId, idBySlug };
}

/** ☐ هر درخواست محصول یک درخواست /categories هم دارد؛ بعد از پایدار شدن API کش شود. */
async function loadCategoryIndex(signal?: AbortSignal): Promise<CategoryIndex> {
  return indexCategories(await fetchCategories(signal));
}

export async function fetchProducts(
  params: ProductListParams = {},
  signal?: AbortSignal,
): Promise<Page<Product>> {
  const q = params.q?.trim();
  if (q && q.length < MIN_SEARCH_LENGTH) return { items: [], nextCursor: null };

  const categories = await loadCategoryIndex(signal);
  let categoryId: string | undefined;
  if (params.category) {
    categoryId = categories.idBySlug.get(params.category);
    if (!categoryId) return { items: [], nextCursor: null };
  }

  const res = await api.get<ProductsPageDto>(q ? "/products/search" : "/products", {
    query: {
      q,
      pageSize: params.limit,
      nextCursor: params.cursor,
      categoryId,
      sort: params.sort ? SORT_PARAM[params.sort] : DEFAULT_SORT,
      minPrice: params.minPrice === undefined ? undefined : tomanToRial(params.minPrice),
      maxPrice: params.maxPrice === undefined ? undefined : tomanToRial(params.maxPrice),
      inStock: params.inStock ? true : undefined,
    },
    signal,
  });
  return {
    items: res.data.items.map((p) => toProduct(p, categories.byId)),
    nextCursor: res.data.nextCursor ?? null,
  };
}

/** یک محصول با slug؛ اگر پیدا نشود (۴۰۴) null برمی‌گرداند. */
export async function fetchProduct(slug: string, signal?: AbortSignal): Promise<Product | null> {
  try {
    const [res, categories] = await Promise.all([
      api.get<ProductDetailDto>(`/products/slug/${encodeURIComponent(slug)}`, { signal }),
      loadCategoryIndex(signal),
    ]);
    return toProductDetail(res.data, categories.byId);
  } catch (error) {
    if (isApiRequestError(error) && error.status === 404) return null;
    throw error;
  }
}
