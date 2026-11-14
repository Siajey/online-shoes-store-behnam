import { mediaUrl } from "@/lib/media";
import { rialToToman } from "@/lib/money";
import type { ProductDetailDto, ProductListItemDto, PublicVariantDto } from "./dto";
import type { Product, ProductVariant } from "./types";

/** نام فارسی ویژگی‌ها؛ نام ناشناخته همان‌طور که هست نمایش داده می‌شود. */
const ATTRIBUTE_LABELS: Record<string, string> = { size: "سایز", color: "رنگ" };

export const attributeLabel = (name: string) => ATTRIBUTE_LABELS[name] ?? name;

/** نام و slug دسته بر اساس شناسه (از درخت /categories). */
export type CategoryLookup = ReadonlyMap<string, { name: string; slug: string }>;

/**
 * بک‌اند ویژگی‌های ترکیب را آرایه‌ی {name, value} می‌دهد؛ شکل شیء هم پذیرفته می‌شود.
 * مقدار همیشه رشته می‌شود تا بقیه‌ی برنامه فقط رشته ببیند.
 */
function attributePairs(attributes: PublicVariantDto["attributes"]): [string, string][] {
  const pairs: [string, string | number][] = Array.isArray(attributes)
    ? attributes.map((a) => [a.name, a.value])
    : Object.entries(attributes);
  return pairs.map(([name, value]) => [name, String(value)]);
}

function toVariant(v: PublicVariantDto): ProductVariant {
  return {
    id: v.id,
    price: rialToToman(v.price),
    available: v.isAvailable,
    options: Object.fromEntries(
      attributePairs(v.attributes).map(([name, value]) => [attributeLabel(name), value]),
    ),
  };
}

/** تنها جایی که شکل API (آیتم لیست) به مدل فرانت تبدیل می‌شود. */
export function toProduct(dto: ProductListItemDto, categories?: CategoryLookup): Product {
  const category = dto.categoryId ? categories?.get(dto.categoryId) : undefined;
  const min = rialToToman(dto.minPrice ?? 0);
  const max = dto.maxPrice === null ? null : rialToToman(dto.maxPrice);
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    price: min,
    maxPrice: max !== null && max > min ? max : undefined,
    imageUrl: mediaUrl(dto.primaryImage?.fileKey),
    available: dto.inStock && dto.minPrice !== null,
    categoryName: category?.name,
    categorySlug: category?.slug,
  };
}

/** جزئیات محصول: همان آیتم لیست + توضیحات، گالری و ترکیب‌های سایز/رنگ. */
export function toProductDetail(dto: ProductDetailDto, categories?: CategoryLookup): Product {
  const base = toProduct(dto, categories);
  const images = dto.images.map((i) => mediaUrl(i.fileKey)).filter((u): u is string => Boolean(u));
  return {
    ...base,
    description: dto.description || undefined,
    images: images.length > 0 ? images : undefined,
    imageUrl: base.imageUrl ?? images[0],
    variants: dto.variants.length > 0 ? dto.variants.map(toVariant) : undefined,
  };
}
