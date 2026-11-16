import { toEnglishDigits } from "@/lib/format";

export type RawSearchParams = Record<string, string | string[] | undefined>;

/** ترتیب نمایش. نبودن sort یعنی پیش‌فرض (تازه‌ترین). ☐ نام و مقدارها با Swagger تطبیق داده شود. */
export const SORTS = ["price-asc", "price-desc"] as const;
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
  /** مقدارهای رنگ انتخاب‌شده (چندتایی) */
  colors?: string[];
  /** مقدارهای سایز انتخاب‌شده (چندتایی) */
  sizes?: string[];
  /** slug برند (فقط یکی؛ بک‌اند یک brandId می‌گیرد) */
  brand?: string;
  /** شماره‌ی صفحه؛ نبودن یعنی صفحه‌ی ۱ */
  page?: number;
};

/** هر صفحه با پیمایش cursor ساخته می‌شود؛ پس سقف کم است. */
export const MAX_PAGE = 20;
const MAX_MULTI = 10;

const MAX_PRICE = 1_000_000_000;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function parsePrice(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const digits = toEnglishDigits(value).replace(/[,٬\s]/g, "");
  if (!/^\d{1,10}$/.test(digits)) return undefined;
  const n = Number(digits);
  return n <= MAX_PRICE ? n : undefined;
}

const all = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value : value === undefined ? [] : [value];

/** مقدارهای چندتایی: خالی/طولانی حذف، تکراری یکی، حداکثر ۱۰ تا. */
function parseMulti(value: string | string[] | undefined): string[] | undefined {
  const list = [
    ...new Set(
      all(value)
        .map((v) => v.trim())
        .filter((v) => v && v.length <= 40),
    ),
  ];
  return list.length > 0 ? list.slice(0, MAX_MULTI) : undefined;
}

function parsePage(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const digits = toEnglishDigits(value).trim();
  if (!/^\d{1,2}$/.test(digits)) return undefined;
  const n = Number(digits);
  return n > 1 && n <= MAX_PAGE ? n : undefined;
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
  const brand = first(raw.brand)?.trim();
  return {
    colors: parseMulti(raw.color),
    sizes: parseMulti(raw.size),
    brand: brand && /^[a-z0-9-]{1,80}$/i.test(brand) ? brand : undefined,
    page: parsePage(first(raw.page)),
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
  return [
    f.minPrice !== undefined || f.maxPrice !== undefined,
    f.inStock,
    f.colors?.length,
    f.sizes?.length,
    f.brand,
  ].filter(Boolean).length;
}

/**
 * فیلترها به‌صورت جفت‌های name/value مثل فیلد پنهان فرم (برای حفظ فیلترها هنگام جستجو یا مرتب‌سازی).
 * skip: نام فیلدهایی که نباید بیایند.
 */
export function filterFields(
  f: ProductFilters,
  skip: readonly string[] = [],
): { name: string; value: string }[] {
  const out: { name: string; value: string }[] = [];
  const add = (name: string, value: string | number | undefined) => {
    if (value !== undefined && value !== "" && !skip.includes(name))
      out.push({ name, value: String(value) });
  };
  add("q", f.q);
  add("category", f.category);
  add("sort", f.sort);
  add("minPrice", f.minPrice);
  add("maxPrice", f.maxPrice);
  if (f.inStock) add("inStock", "1");
  add("brand", f.brand);
  for (const c of f.colors ?? []) add("color", c);
  for (const s of f.sizes ?? []) add("size", s);
  return out;
}

/** ویژگی‌های انتخاب‌شده به قالب بک‌اند: «name:v1,v2;name2:v3». نام‌ها از پاسخ /products/filters می‌آیند. */
export function attributesParam(
  selected: Record<string, readonly string[] | undefined>,
): string | undefined {
  const parts = Object.entries(selected)
    .filter(([, values]) => values && values.length > 0)
    .map(([name, values]) => `${name}:${(values ?? []).join(",")}`);
  return parts.length > 0 ? parts.join(";") : undefined;
}

/** آدرس صفحه‌ی محصولات با فیلترها؛ over مقدارها را عوض می‌کند (undefined یعنی حذف). تغییر فیلتر، صفحه را به ۱ برمی‌گرداند مگر page داده شود. */
export function productsHref(f: ProductFilters, over: Partial<ProductFilters> = {}): string {
  const merged: ProductFilters = { ...f, page: undefined, ...over };
  const params = new URLSearchParams();
  for (const { name, value } of filterFields(merged)) params.append(name, value);
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));
  const text = params.toString();
  return text ? `/products?${text}` : "/products";
}
