import Link from "next/link";
import { Suspense } from "react";
import { Benefits } from "@/features/landing/components/benefits";
import { Hero } from "@/features/landing/components/hero";
import { landingCopy } from "@/features/landing/copy";
import { ProductGridSkeleton } from "@/features/products/components/product-grid";
import { ProductSection } from "@/features/products/components/product-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <Benefits />

      <section className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium lg:text-[28px]">{landingCopy.productsTitle}</h2>
          <Link href="/products" className="text-brand text-sm">
            {landingCopy.viewAll}
          </Link>
        </div>
        <div className="mt-6">
          {/* ☐ وقتی API مرتب‌سازی (پرفروش/تازه) را مشخص کرد، دو بخش جدا مثل طرح ساخته می‌شود. */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductSection params={{ limit: 4 }} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
