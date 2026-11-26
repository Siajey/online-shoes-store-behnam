import { api, type Page } from "@/lib/api";
import { isApiRequestError } from "@/lib/api/errors";
import { fetchCategories } from "@/features/categories/api";
import type { Category } from "@/features/categories/types";
import type { CatalogFiltersDto, ProductDetailDto, ProductsPageDto } from "./dto";
import { COLOR_ATTRIBUTE, SIZE_ATTRIBUTE, isColorAttribute, isSizeAttribute } from "./colors";
import { attributesParam, type ProductSort } from "./filters";
import { toProduct, toProductDetail, type CategoryLookup } from "./mappers";
import type { CatalogFacets, Product } from "./types";

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
  /** شناسه‌ی برند (از facets) */
  brandId?: string;
  /** رنگ‌ها و سایزهای انتخاب‌شده؛ نام ویژگی از facets می‌آید و پیش‌فرضش «رنگ» و «سایز» است */
  colors?: readonly string[];
  sizes?: readonly string[];
  colorAttribute?: string;
  sizeAttribute?: string;
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
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      inStock: params.inStock ? true : undefined,
      brandId: params.brandId,
      attributes: attributesParam({
        [params.colorAttribute ?? COLOR_ATTRIBUTE]: params.colors,
        [params.sizeAttribute ?? SIZE_ATTRIBUTE]: params.sizes,
      }),
    },
    signal,
  });
  return {
    items: res.data.items.map((p) => toProduct(p, categories.byId)),
    nextCursor: res.data.nextCursor ?? null,
  };
}

/**
 * صفحه‌ی N ام لیست. بک‌اند فقط cursor دارد، پس صفحه‌ی N با N-1 بار جلو رفتن پیدا می‌شود
 * (به همین دلیل MAX_PAGE کم است). hasNext از nextCursor می‌آید؛ تعداد کل در دست نیست.
 */
export async function fetchProductsPage(
  params: Omit<ProductListParams, "cursor">,
  page: number,
  signal?: AbortSignal,
): Promise<{ items: Product[]; page: number; hasNext: boolean }> {
  let cursor: string | undefined;
  for (let current = 1; ; current += 1) {
    const result = await fetchProducts({ ...params, cursor }, signal);
    if (current >= page) {
      return { items: result.items, page: current, hasNext: result.nextCursor !== null };
    }
    // صفحه‌ی خواسته‌شده بیشتر از تعداد واقعی است: آخرین صفحه‌ی موجود را بده.
    if (result.nextCursor === null) return { items: result.items, page: current, hasNext: false };
    cursor = result.nextCursor;
  }
}

/** گزینه‌های فیلتر (برند، قیمت، رنگ، سایز) برای یک دسته یا کل کاتالوگ. */
export async function fetchCatalogFacets(
  categoryId?: string,
  signal?: AbortSignal,
): Promise<CatalogFacets> {
  const res = await api.get<CatalogFiltersDto>("/products/filters", {
    query: { categoryId },
    signal,
  });
  const attributes = res.data.attributes ?? [];
  const color = attributes.find((a) => isColorAttribute(a.name));
  const size = attributes.find((a) => isSizeAttribute(a.name));
  const range = res.data.priceRange;
  return {
    brands: res.data.brands ?? [],
    priceRange: range ? { min: range.min, max: range.max } : null,
    colorAttribute: color?.name ?? COLOR_ATTRIBUTE,
    colors: color?.values ?? [],
    sizeAttribute: size?.name ?? SIZE_ATTRIBUTE,
    sizes: size?.values ?? [],
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
