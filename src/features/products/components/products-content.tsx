import { SearchBar } from "@/components/layout/search-bar";
import { StateMessage } from "@/components/ui/state-message";
import { fetchCategories } from "@/features/categories/api";
import { CategoryFilter } from "@/features/categories/components/category-filter";
import { findCategoryTrail } from "@/features/categories/trail";
import { apiCopy } from "@/lib/api/copy";
import { isApiRequestError } from "@/lib/api/errors";
import { MIN_SEARCH_LENGTH, fetchProducts } from "../api";
import { PRODUCTS_PAGE_SIZE } from "../constants";
import { productCopy } from "../copy";
import { parseProductFilters, productsHref, type RawSearchParams } from "../filters";
import { ProductList } from "./product-list";
import { ProductsToolbar } from "./products-toolbar";

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

      <SearchBar
        className="mt-4 lg:hidden"
        defaultValue={filters.q}
        minLength={MIN_SEARCH_LENGTH}
        clearHref={productsHref(filters, { q: undefined })}
        hidden={hiddenFilters(filters)}
      />

      {categories.length > 0 && <CategoryFilter categories={categories} trail={trail} />}

      <ProductsToolbar filters={filters} />

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

/** فیلترهایی که با جستجوی تازه حفظ می‌شوند (جستجو و دسته‌ی فعلی جدا مدیریت می‌شوند). */
function hiddenFilters(f: ReturnType<typeof parseProductFilters>) {
  const out: { name: string; value: string }[] = [];
  if (f.category) out.push({ name: "category", value: f.category });
  if (f.sort) out.push({ name: "sort", value: f.sort });
  if (f.minPrice !== undefined) out.push({ name: "minPrice", value: String(f.minPrice) });
  if (f.maxPrice !== undefined) out.push({ name: "maxPrice", value: String(f.maxPrice) });
  if (f.inStock) out.push({ name: "inStock", value: "1" });
  return out;
}
