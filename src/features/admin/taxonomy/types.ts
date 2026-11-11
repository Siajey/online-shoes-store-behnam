export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
};

export type AdminBrand = {
  id: string;
  name: string;
  slug: string;
  logoKey: string | null;
};

export type CategoryInput = { name: string; slug: string; parentId: string; sortOrder: string };
export type BrandInput = { name: string; slug: string; logoKey: string };
