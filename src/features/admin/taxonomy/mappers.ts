import type { AdminBrandDto, AdminCategoryDto } from "./dto";
import type { AdminBrand, AdminCategory } from "./types";

export const toAdminCategory = (d: AdminCategoryDto): AdminCategory => ({
  id: d.id,
  name: d.name,
  slug: d.slug,
  parentId: d.parentId ?? null,
  sortOrder: d.sortOrder ?? 0,
});

export const toAdminBrand = (d: AdminBrandDto): AdminBrand => ({
  id: d.id,
  name: d.name,
  slug: d.slug,
  logoKey: d.logoKey ?? null,
});
