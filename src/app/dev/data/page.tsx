import { notFound } from "next/navigation";
import { CategoryGrid } from "@/features/categories/components/category-grid";
import { toCategory } from "@/features/categories/mappers";
import type { CategoryDto } from "@/features/categories/dto";
import categoriesSample from "@/features/categories/__fixtures__/categories.json";
import { ProductGrid } from "@/features/products/components/product-grid";
import { toProduct } from "@/features/products/mappers";
import type { ProductDto } from "@/features/products/dto";
import productsSample from "@/features/products/__fixtures__/products.json";

/** پیش‌نمایش با «نمونه‌ی واقعی پاسخ بک‌اند»؛ فقط در حالت توسعه باز می‌شود. */
export default function DataPreview() {
  if (process.env.NODE_ENV === "production") notFound();

  const categories = (categoriesSample.data as unknown as CategoryDto[]).map(toCategory);
  const products = (productsSample.data as unknown as ProductDto[]).map(toProduct);

  return (
    <main className="mx-auto flex w-full max-w-300 flex-col gap-10 p-6">
      <p className="text-fg-muted text-sm">
        این صفحه فقط برای توسعه است و داده را از فایل‌های نمونه‌ی بک‌اند (__fixtures__) می‌خواند، نه
        از API.
      </p>
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">دسته‌بندی‌ها</h1>
        <CategoryGrid categories={categories} />
      </section>
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">محصولات</h1>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
