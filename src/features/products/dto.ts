/**
 * شکل پاسخ ماژول محصول بک‌اند (milestone-2-endpoints.md). قیمت‌ها عدد صحیح‌اند.
 * همه‌ی تبدیل‌ها فقط در mappers.ts انجام می‌شود.
 * ☐ واحد قیمت (تومان یا ریال) با همکار بک‌اند تأیید شود؛ فعلاً تومان فرض شده.
 */
/** url: آدرس کامل تصویر که بک‌اند از روی کلید می‌سازد؛ اگر نبود از کلید و CDN ساخته می‌شود. */
export type ProductImageDto = { fileKey: string; url?: string; altText: string | null };

export type ProductTagDto = "newest" | "best_seller" | "popular";

/** قیمت‌های اصلی و نهایی (بعد از تخفیف) و برچسب‌ها؛ مبلغ‌ها ریال‌اند. */
export type ProductMetaDto = {
  tags: ProductTagDto[];
  pricing: {
    minPrice: number | null;
    maxPrice: number | null;
    finalMinPrice: number | null;
    finalMaxPrice: number | null;
    hasDiscount: boolean;
    maxDiscountPercent: number;
  };
};

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
  /** تخفیف واقعی و برچسب‌ها؛ در پاسخ‌های قدیمی‌تر ممکن است نباشد. */
  meta?: ProductMetaDto;
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
