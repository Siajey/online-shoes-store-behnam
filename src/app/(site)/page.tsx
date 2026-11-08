import Link from "next/link";
import { Suspense } from "react";
import { CategoryGridSkeleton } from "@/features/categories/components/category-grid";
import { CategorySection } from "@/features/categories/components/category-section";
import { WelcomeGate } from "@/features/welcome/components/welcome-gate";
import { Benefits } from "@/features/landing/components/benefits";
import { Hero } from "@/features/landing/components/hero";
import { landingCopy } from "@/features/landing/copy";
import { ProductGridSkeleton } from "@/features/products/components/product-grid";
import { ProductSection } from "@/features/products/components/product-section";

const sectionClass = "mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10";

export default function Home() {
  return (
    <main>
      <WelcomeGate />
      <Hero />
      <Benefits />

      <section id="categories" className={`${sectionClass} scroll-mt-4`}>
        <h2 className="text-2xl font-medium lg:text-[28px]">{landingCopy.categoriesTitle}</h2>
        <div className="mt-6">
          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategorySection />
          </Suspense>
        </div>
      </section>

      <section className={sectionClass}>
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
