import { api } from "@/lib/api";
import type { CategoryDto } from "./dto";
import { toCategory } from "./mappers";
import type { Category } from "./types";

/** درخت دسته‌بندی‌ها؛ آیتم‌های سطح اول دسته‌های اصلی‌اند. */
export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const res = await api.get<CategoryDto[]>("/categories", { signal });
  return res.data.map(toCategory);
}
