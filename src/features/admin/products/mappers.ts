import type { AdminProductDto } from "./dto";
import { PRODUCT_STATUSES, type AdminProduct, type ProductStatus } from "./types";

export function toStatus(value: string): ProductStatus {
  return (PRODUCT_STATUSES as readonly string[]).includes(value)
    ? (value as ProductStatus)
    : "draft";
}

export function toAdminProduct(dto: AdminProductDto): AdminProduct {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    status: toStatus(dto.status),
    imageKey: dto.primaryImage?.fileKey,
    minPrice: dto.minPrice ?? null,
    maxPrice: dto.maxPrice ?? null,
    inStock: dto.inStock,
    variantCount: dto.variantCount,
    activeVariantCount: dto.activeVariantCount,
    updatedAt: dto.updatedAt,
  };
}
