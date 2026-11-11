export type ProductStatus = "draft" | "published" | "archived";
export const PRODUCT_STATUSES: readonly ProductStatus[] = ["draft", "published", "archived"];

/** عملیات تغییر وضعیت؛ هر کدام یک endpoint در بک‌اند است. */
export type StatusAction = "publish" | "unpublish" | "archive";

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  /** فقط کلید ذخیره‌سازی؛ آدرس نمایشی با mediaUrl ساخته می‌شود */
  imageKey?: string;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  variantCount: number;
  activeVariantCount: number;
  updatedAt: string;
};
