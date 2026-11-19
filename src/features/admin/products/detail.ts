import { rialToToman } from "@/lib/money";
import { mediaUrl } from "@/lib/media";
import type { ProductFormInput } from "./form";
import type { GalleryImage } from "./gallery/gallery";
import type { ProductStatus } from "./types";

/** GET/POST/PATCH /admin/products (ProductPresenter.adminDetail) */
export type AdminVariantDto = {
  id: string;
  title: string | null;
  sku: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  /** بک‌اند آرایه‌ی {name, value} می‌دهد؛ شکل شیء هم پذیرفته می‌شود. */
  attributes: { name: string; value: string | number }[] | Record<string, string | number>;
};

export type AdminProductDetailDto = {
  id: string;
  type: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  categoryId: string | null;
  brandId: string | null;
  details: { gender: string; material: string | null } | null;
  publishedAt: string | null;
  variants?: AdminVariantDto[];
  /** تصاویر گالری؛ url آدرس کامل ساخته‌شده‌ی بک‌اند است. */
  images?: {
    id: string;
    fileKey: string;
    url?: string;
    altText: string | null;
    position: number;
  }[];
};

export type AdminVariant = {
  id: string;
  title: string;
  sku?: string;
  price: number;
  stock: number;
  isActive: boolean;
  attributes: Record<string, string>;
};

export type AdminProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  categoryId: string;
  brandId: string;
  gender: string;
  material: string;
  /** بعد از اولین انتشار slug قفل می‌شود */
  slugLocked: boolean;
  variants: AdminVariant[];
  /** گالری به ترتیب نمایش؛ اولی تصویر اصلی است. */
  images: GalleryImage[];
};

/** ویژگی‌های ترکیب (سایز، رنگ…) به شیء «نام → مقدار رشته‌ای». */
export function normalizeAttributes(
  raw: AdminVariantDto["attributes"] | null | undefined,
): Record<string, string> {
  if (!raw) return {};
  const pairs: [string, string | number][] = Array.isArray(raw)
    ? raw.map((a) => [a.name, a.value])
    : Object.entries(raw);
  return Object.fromEntries(pairs.map(([name, value]) => [name, String(value)]));
}

export function toVariant(d: AdminVariantDto): AdminVariant {
  return {
    id: d.id,
    title: d.title?.trim() || d.sku || "بدون عنوان",
    sku: d.sku ?? undefined,
    price: rialToToman(d.price),
    stock: d.stock,
    isActive: d.isActive,
    attributes: normalizeAttributes(d.attributes),
  };
}

export function toProductDetail(
  d: AdminProductDetailDto,
  toStatus: (v: string) => ProductStatus,
): AdminProductDetail {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description ?? "",
    status: toStatus(d.status),
    categoryId: d.categoryId ?? "",
    brandId: d.brandId ?? "",
    gender: d.details?.gender ?? "",
    material: d.details?.material ?? "",
    slugLocked: d.publishedAt !== null,
    variants: (d.variants ?? []).map(toVariant),
    images: [...(d.images ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((i) => ({
        fileKey: i.fileKey,
        url: i.url || mediaUrl(i.fileKey),
        altText: i.altText ?? "",
      })),
  };
}

export function toFormInput(p: AdminProductDetail): ProductFormInput {
  return {
    name: p.name,
    slug: p.slug,
    description: p.description,
    categoryId: p.categoryId,
    brandId: p.brandId,
    gender: p.gender,
    material: p.material,
  };
}
