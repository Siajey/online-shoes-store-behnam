import { StateMessage } from "@/components/ui/state-message";
import { apiCopy } from "@/lib/api/copy";
import { isApiRequestError } from "@/lib/api/errors";
import { fetchCategories } from "../api";
import { categoryCopy } from "../copy";
import type { Category } from "../types";
import { CategoryGrid } from "./category-grid";

/** بخش دسته‌بندی‌ها با سه حالت خطا، خالی و لیست. باید داخل <Suspense> استفاده شود. */
export async function CategorySection() {
  let categories: Category[];
  try {
    categories = await fetchCategories();
  } catch (error) {
    return (
      <StateMessage tone="error">
        {isApiRequestError(error) ? error.message : apiCopy.unknown}
      </StateMessage>
    );
  }

  if (categories.length === 0) return <StateMessage>{categoryCopy.empty}</StateMessage>;
  return <CategoryGrid categories={categories} />;
}
