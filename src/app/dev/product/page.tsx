import { notFound } from "next/navigation";
import { ProductDetail } from "@/features/products/components/product-detail";
import type { ProductDto } from "@/features/products/dto";
import { toProduct } from "@/features/products/mappers";
import productsSample from "@/features/products/__fixtures__/products.json";

/** پیش‌نمایش صفحه‌ی تک‌محصول با «نمونه‌ی واقعی پاسخ بک‌اند»؛ فقط در حالت توسعه باز می‌شود. */
export default function ProductPreview() {
  if (process.env.NODE_ENV === "production") notFound();

  const products = (productsSample.data as unknown as ProductDto[]).map(toProduct);

  return (
    <main className="mx-auto flex w-full max-w-300 flex-col gap-16 px-4 py-6 lg:px-8 lg:py-10">
      <p className="text-fg-muted text-sm">
        پیش‌نمایش توسعه با نمونه‌ی بک‌اند (__fixtures__). محصول اول (تخفیف‌دار) و آخر (ناموجود)
        نمایش داده می‌شوند.
      </p>
      <section>
        <ProductDetail product={products[0]} />
      </section>
      <section>
        <ProductDetail product={products[5]} />
      </section>
    </main>
  );
}
