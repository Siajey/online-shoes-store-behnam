import type { ProductDto, VariantDto } from "./dto";
import type { Product, ProductVariant } from "./types";

/** فرانت همه‌چیز را به تومان نگه می‌دارد (تصمیم D-013). */
function toToman(amount: number, currency: string): number {
  return currency.toUpperCase() === "RIAL" ? Math.round(amount / 10) : amount;
}

function toVariant(v: VariantDto, currency: string): ProductVariant {
  return {
    id: v.id,
    sku: v.sku || undefined,
    price: toToman(v.price, currency),
    available: v.isActive && v.stock > 0,
    options: Object.fromEntries(v.attributes.map((a) => [a.name, a.value])),
  };
}

/** تنها جایی که شکل API به مدل فرانت تبدیل می‌شود. */
export function toProduct(dto: ProductDto): Product {
  const { pricing } = dto;
  const hasDiscount = pricing.discount !== null && pricing.originalPrice > pricing.finalPrice;

  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    sku: dto.sku || undefined,
    price: toToman(pricing.finalPrice, pricing.currency),
    originalPrice: hasDiscount ? toToman(pricing.originalPrice, pricing.currency) : undefined,
    discountLabel: hasDiscount ? pricing.discount?.label : undefined,
    tag: dto.badges[0]?.label,
    imageUrl: dto.thumbnail || undefined,
    available: dto.isAvailable,
    categoryName: dto.category?.name,
    categorySlug: dto.category?.slug,
    variants: dto.variants?.length
      ? dto.variants.map((v) => toVariant(v, pricing.currency))
      : undefined,
  };
}
