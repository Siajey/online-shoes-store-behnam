import { fetchProducts } from "../api";
import { productCopy } from "../copy";
import type { Product } from "../types";
import { ProductGrid } from "./product-grid";

/** محصولات هم‌دسته. بخش غیرضروری است؛ در خطا یا خالی بودن، چیزی نشان داده نمی‌شود. باید داخل <Suspense> باشد. */
export async function RelatedProducts({
  categorySlug,
  excludeId,
}: {
  categorySlug: string;
  excludeId: string;
}) {
  let items: Product[];
  try {
    items = (await fetchProducts({ category: categorySlug, limit: 5 })).items;
  } catch {
    return null;
  }

  const related = items.filter((p) => p.id !== excludeId).slice(0, 4);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 lg:mt-16">
      <h2 className="mb-6 text-2xl font-medium lg:text-[28px]">{productCopy.related}</h2>
      <ProductGrid products={related} />
    </section>
  );
}
