import { mediaUrl } from "@/lib/media";
import type { ProductDetailDto, ProductListItemDto, PublicVariantDto } from "./dto";
import type { Product, ProductVariant } from "./types";

/** نام فارسی ویژگی‌ها؛ نام ناشناخته همان‌طور که هست نمایش داده می‌شود. */
const ATTRIBUTE_LABELS: Record<string, string> = { size: "سایز", color: "رنگ" };

export const attributeLabel = (name: string) => ATTRIBUTE_LABELS[name] ?? name;

/** نام و slug دسته بر اساس شناسه (از درخت /categories). */
export type CategoryLookup = ReadonlyMap<string, { name: string; slug: string }>;

function toVariant(v: PublicVariantDto): ProductVariant {
  return {
    id: v.id,
    price: v.price,
    available: v.isAvailable,
    options: Object.fromEntries(
      Object.entries(v.attributes).map(([name, value]) => [attributeLabel(name), value]),
    ),
  };
}

/** تنها جایی که شکل API (آیتم لیست) به مدل فرانت تبدیل می‌شود. */
export function toProduct(dto: ProductListItemDto, categories?: CategoryLookup): Product {
  const category = dto.categoryId ? categories?.get(dto.categoryId) : undefined;
  const min = dto.minPrice ?? 0;
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    price: min,
    maxPrice: dto.maxPrice !== null && dto.maxPrice > min ? dto.maxPrice : undefined,
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
