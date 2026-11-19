import { mediaUrl } from "@/lib/media";
import { toPersianDigits } from "@/lib/format";
import { rialToToman } from "@/lib/money";
import { isColorAttribute } from "./colors";
import type {
  ProductDetailDto,
  ProductImageDto,
  ProductListItemDto,
  ProductTagDto,
  PublicVariantDto,
} from "./dto";
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
/** نام رنگ‌ها از options؛ تکراری‌ها حذف می‌شوند. */
function colorsOf(options: Record<string, string[]> | undefined): string[] | undefined {
  if (!options) return undefined;
  const key = Object.keys(options).find(isColorAttribute);
  const list = key ? [...new Set(options[key].map((v) => String(v).trim()).filter(Boolean))] : [];
  return list.length > 0 ? list : undefined;
}

const TAG_LABELS: Record<ProductTagDto, string> = {
  best_seller: "پرفروش",
  popular: "محبوب",
  newest: "جدید",
};
/** اگر چند برچسب داشت، مهم‌ترین نمایش داده می‌شود. */
const TAG_PRIORITY: readonly ProductTagDto[] = ["best_seller", "popular", "newest"];

const tagOf = (tags: readonly ProductTagDto[] | undefined): string | undefined => {
  const top = TAG_PRIORITY.find((t) => tags?.includes(t));
  return top ? TAG_LABELS[top] : undefined;
};

/** تصویر: آدرس کامل بک‌اند، وگرنه ساخت از کلید و CDN. */
const imageUrlOf = (image: ProductImageDto | null | undefined): string | undefined =>
  image?.url || mediaUrl(image?.fileKey);

/**
 * قیمت نمایشی: اگر بک‌اند قیمت نهایی (بعد از تخفیف) داده، همان است و قیمت اصلی خط‌خورده می‌شود.
 * درصد تخفیف از همین دو قیمت نمایش‌داده‌شده حساب می‌شود تا با کارت ناسازگار نباشد.
 */
function pricingOf(
  dto: ProductListItemDto,
): Pick<Product, "price" | "maxPrice" | "originalPrice" | "discountLabel"> {
  const pricing = dto.meta?.pricing;
  const base = pricing?.finalMinPrice ?? dto.minPrice;
  const baseMax = pricing?.finalMaxPrice ?? dto.maxPrice;
  const price = rialToToman(base ?? 0);
  const max = baseMax === null || baseMax === undefined ? null : rialToToman(baseMax);
  const original =
    pricing?.hasDiscount && pricing.minPrice !== null ? rialToToman(pricing.minPrice) : undefined;
  const discounted = original !== undefined && original > price;
  const percent = discounted ? Math.max(1, Math.floor(((original - price) * 100) / original)) : 0;
  return {
    price,
    maxPrice: max !== null && max > price ? max : undefined,
    originalPrice: discounted ? original : undefined,
    discountLabel: discounted ? `${toPersianDigits(percent)}٪ تخفیف` : undefined,
  };
}

export function toProduct(dto: ProductListItemDto, categories?: CategoryLookup): Product {
  const category = dto.categoryId ? categories?.get(dto.categoryId) : undefined;
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    ...pricingOf(dto),
    tag: tagOf(dto.meta?.tags),
    imageUrl: imageUrlOf(dto.primaryImage),
    available: dto.inStock && dto.minPrice !== null,
    colors: colorsOf(dto.options),
    categoryName: category?.name,
    categorySlug: category?.slug,
  };
}

const GENDER_LABELS: Record<string, string> = {
  men: "مردانه",
  women: "زنانه",
  unisex: "یونیسکس",
  kids: "بچگانه",
  boys: "پسرانه",
  girls: "دخترانه",
};

/** مشخصات قابل‌نمایش از details و دسته؛ فقط مقدار موجود می‌آید (چیزی ساختگی نیست). */
function specsOf(dto: ProductListItemDto, categoryName?: string): Product["specs"] {
  const specs: { label: string; value: string }[] = [];
  const material = dto.details?.material?.trim();
  if (material) specs.push({ label: "جنس", value: material });
  const gender = dto.details?.gender?.trim();
  if (gender) specs.push({ label: "جنسیت", value: GENDER_LABELS[gender.toLowerCase()] ?? gender });
  if (categoryName) specs.push({ label: "دسته‌بندی", value: categoryName });
  return specs.length > 0 ? specs : undefined;
}

/** جزئیات محصول: همان آیتم لیست + توضیحات، گالری و ترکیب‌های سایز/رنگ. */
export function toProductDetail(dto: ProductDetailDto, categories?: CategoryLookup): Product {
  const base = toProduct(dto, categories);
  const images = dto.images.map(imageUrlOf).filter((u): u is string => Boolean(u));
  return {
    ...base,
    description: dto.description || undefined,
    specs: specsOf(dto, base.categoryName),
    images: images.length > 0 ? images : undefined,
    imageUrl: base.imageUrl ?? images[0],
    variants: dto.variants.length > 0 ? dto.variants.map(toVariant) : undefined,
  };
}
