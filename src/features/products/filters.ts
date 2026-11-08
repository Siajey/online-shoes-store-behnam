import { toEnglishDigits } from "@/lib/format";

export type RawSearchParams = Record<string, string | string[] | undefined>;

/** ترتیب نمایش. نبودن sort یعنی پیش‌فرض (تازه‌ترین). ☐ نام و مقدارها با Swagger تطبیق داده شود. */
export const SORTS = ["price-asc", "price-desc", "discount"] as const;
export type ProductSort = (typeof SORTS)[number];

export type ProductFilters = {
  /** slug دسته‌بندی */
  category?: string;
  /** عبارت جستجو */
  q?: string;
  sort?: ProductSort;
  /** به تومان، عدد صحیح */
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
};

const MAX_PRICE = 1_000_000_000;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function parsePrice(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const digits = toEnglishDigits(value).replace(/[,٬\s]/g, "");
  if (!/^\d{1,10}$/.test(digits)) return undefined;
  const n = Number(digits);
  return n <= MAX_PRICE ? n : undefined;
}

/** پارامترهای آدرس را پاک‌سازی می‌کند؛ هر مقدار نامعتبر نادیده گرفته می‌شود. */
export function parseProductFilters(raw: RawSearchParams): ProductFilters {
  const category = first(raw.category)?.trim();
  const q = first(raw.q)?.trim().slice(0, 100);
  const sort = first(raw.sort);
  let minPrice = parsePrice(first(raw.minPrice));
  let maxPrice = parsePrice(first(raw.maxPrice));
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }
  return {
    category: category && /^[a-z0-9-]{1,80}$/i.test(category) ? category : undefined,
    q: q || undefined,
    sort: SORTS.find((s) => s === sort),
    minPrice,
    maxPrice,
    inStock: first(raw.inStock) === "1" ? true : undefined,
  };
}

/** تعداد فیلترهای فعال (جستجو و دسته جدا هستند). */
export function activeFilterCount(f: ProductFilters): number {
  return [f.minPrice !== undefined || f.maxPrice !== undefined, f.inStock].filter(Boolean).length;
}

/** آدرس صفحه‌ی محصولات با فیلترها؛ over مقدارها را عوض می‌کند (undefined یعنی حذف). */
export function productsHref(f: ProductFilters, over: Partial<ProductFilters> = {}): string {
  const merged = { ...f, ...over };
  const params = new URLSearchParams();
  if (merged.category) params.set("category", merged.category);
  if (merged.q) params.set("q", merged.q);
  if (merged.sort) params.set("sort", merged.sort);
  if (merged.minPrice !== undefined) params.set("minPrice", String(merged.minPrice));
  if (merged.maxPrice !== undefined) params.set("maxPrice", String(merged.maxPrice));
  if (merged.inStock) params.set("inStock", "1");
  const text = params.toString();
  return text ? `/products?${text}` : "/products";
}
