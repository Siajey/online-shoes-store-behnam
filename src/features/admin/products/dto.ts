/** آیتم GET /admin/products (ProductPresenter.adminListItem در بک‌اند). */
export type AdminProductDto = {
  id: string;
  type: string;
  name: string;
  slug: string;
  status: string;
  categoryId: string | null;
  brandId: string | null;
  primaryImage: { fileKey: string; altText?: string | null } | null;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  variantCount: number;
  activeVariantCount: number;
  updatedAt: string;
};

export type AdminProductsPageDto = { items: AdminProductDto[]; nextCursor: string | null };

/** پاسخ publish / unpublish / archive (adminProduct) */
export type AdminProductStatusDto = { id: string; status: string };
