import { StateMessage } from "@/components/ui/state-message";
import { fetchCategories } from "@/features/categories/api";
import { CategoryFilter } from "@/features/categories/components/category-filter";
import { findCategoryTrail } from "@/features/categories/trail";
import { apiCopy } from "@/lib/api/copy";
import { isApiRequestError } from "@/lib/api/errors";
import { fetchProducts } from "../api";
import { PRODUCTS_PAGE_SIZE } from "../constants";
import { productCopy } from "../copy";
import { parseProductFilters, type RawSearchParams } from "../filters";
import { ProductList } from "./product-list";

/** محتوای صفحه‌ی /products. باید داخل <Suspense> باشد (چون searchParams داده‌ی زمان درخواست است). */
export async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseProductFilters(await searchParams);

  const [categoriesResult, productsResult] = await Promise.allSettled([
    fetchCategories(),
    fetchProducts({ ...filters, limit: PRODUCTS_PAGE_SIZE }),
  ]);

  // اگر دسته‌ها نیامدند، فقط نوار فیلتر پنهان می‌شود؛ خود لیست کار می‌کند.
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const trail = findCategoryTrail(categories, filters.category);
  const title = filters.q
    ? productCopy.searchResults(filters.q)
    : (trail.active?.name ?? productCopy.allProducts);

  return (
    <>
      <h1 className="text-2xl font-medium lg:text-[28px]">{title}</h1>

      {categories.length > 0 && <CategoryFilter categories={categories} trail={trail} />}

      <div className="mt-6">
        {productsResult.status === "rejected" ? (
          <StateMessage tone="error">
            {isApiRequestError(productsResult.reason)
              ? productsResult.reason.message
              : apiCopy.unknown}
          </StateMessage>
        ) : (
          <ProductList
            key={JSON.stringify(filters)}
            initialItems={productsResult.value.items}
            initialCursor={productsResult.value.nextCursor}
            filters={filters}
          />
        )}
      </div>
    </>
  );
}
