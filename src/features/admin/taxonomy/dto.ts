/** GET /admin/categories (TaxonomyPresenter.adminCategory): فهرست تخت، نه درخت. */
export type AdminCategoryDto = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/** GET /admin/brands (TaxonomyPresenter.adminBrand) */
export type AdminBrandDto = {
  id: string;
  name: string;
  slug: string;
  logoKey: string | null;
  createdAt: string;
  updatedAt: string;
};
