import { api } from "@/lib/api";
import type { AdminBrandDto, AdminCategoryDto } from "./dto";
import { toAdminBrand, toAdminCategory } from "./mappers";
import type { AdminBrand, AdminCategory } from "./types";
import type { BrandPayload, CategoryPayload } from "./validation";

export async function fetchAdminCategories(signal?: AbortSignal): Promise<AdminCategory[]> {
  const res = await api.get<AdminCategoryDto[]>("/admin/categories", { signal });
  return res.data.map(toAdminCategory);
}

export async function createCategory(input: CategoryPayload): Promise<AdminCategory> {
  const res = await api.post<AdminCategoryDto>("/admin/categories", { body: input });
  return toAdminCategory(res.data);
}

export async function updateCategory(id: string, input: CategoryPayload): Promise<AdminCategory> {
  const res = await api.patch<AdminCategoryDto>(`/admin/categories/${encodeURIComponent(id)}`, {
    body: input,
  });
  return toAdminCategory(res.data);
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/admin/categories/${encodeURIComponent(id)}`);
}

export async function fetchAdminBrands(signal?: AbortSignal): Promise<AdminBrand[]> {
  const res = await api.get<AdminBrandDto[]>("/admin/brands", { signal });
  return res.data.map(toAdminBrand);
}

export async function createBrand(input: BrandPayload): Promise<AdminBrand> {
  const res = await api.post<AdminBrandDto>("/admin/brands", { body: input });
  return toAdminBrand(res.data);
}

export async function updateBrand(id: string, input: BrandPayload): Promise<AdminBrand> {
  const res = await api.patch<AdminBrandDto>(`/admin/brands/${encodeURIComponent(id)}`, {
    body: input,
  });
  return toAdminBrand(res.data);
}

export async function deleteBrand(id: string): Promise<void> {
  await api.delete(`/admin/brands/${encodeURIComponent(id)}`);
}
