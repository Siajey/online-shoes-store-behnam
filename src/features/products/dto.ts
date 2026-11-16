/**
 * شکل پاسخ ماژول محصول بک‌اند (milestone-2-endpoints.md). قیمت‌ها عدد صحیح‌اند.
 * همه‌ی تبدیل‌ها فقط در mappers.ts انجام می‌شود.
 * ☐ واحد قیمت (تومان یا ریال) با همکار بک‌اند تأیید شود؛ فعلاً تومان فرض شده.
 */
export type ProductImageDto = { fileKey: string; altText: string | null };

export type ProductListItemDto = {
  id: string;
  type: string;
  name: string;
  slug: string;
  categoryId: string | null;
  brandId: string | null;
  primaryImage: ProductImageDto | null;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  details: { gender?: string; material?: string | null } | null;
  /** گزینه‌های محصول مثل { "رنگ": ["مشکی"] }؛ اگر بک‌اند در لیست بفرستد، رنگ‌ها روی کارت می‌آید. */
  options?: Record<string, string[]>;
};

/** data از GET /products و GET /products/search */
export type ProductsPageDto = { items: ProductListItemDto[]; nextCursor: string | null };

/** ترکیب عمومی؛ موجودی دقیق و SKU عمداً در پاسخ عمومی نیست. */
export type PublicVariantDto = {
  id: string;
  price: number;
  isAvailable: boolean;
  attributes: { name: string; value: string | number }[] | Record<string, string | number>;
};

/** data از GET /products/slug/:slug */
export type ProductDetailDto = ProductListItemDto & {
  description: string;
  images: ProductImageDto[];
  options: Record<string, string[]>;
  variants: PublicVariantDto[];
};

/** data از GET /products/filters؛ قیمت‌ها ریال‌اند. */
export type CatalogFiltersDto = {
  categories?: { id: string; name: string; slug: string; count: number }[];
  brands?: { id: string; name: string; slug: string; count: number }[];
  priceRange?: { min: number; max: number } | null;
  attributes?: { name: string; values: { value: string; count: number }[] }[];
};
