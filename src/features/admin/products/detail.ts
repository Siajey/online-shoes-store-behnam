import { rialToToman } from "@/lib/money";
import type { ProductFormInput } from "./form";
import type { ProductStatus } from "./types";

/** GET/POST/PATCH /admin/products (ProductPresenter.adminDetail) */
export type AdminVariantDto = {
  id: string;
  title: string | null;
  sku: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  attributes: Record<string, string>;
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
};

export function toVariant(d: AdminVariantDto): AdminVariant {
  return {
    id: d.id,
    title: d.title?.trim() || d.sku || "بدون عنوان",
    sku: d.sku ?? undefined,
    price: rialToToman(d.price),
    stock: d.stock,
    isActive: d.isActive,
    attributes: d.attributes ?? {},
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
