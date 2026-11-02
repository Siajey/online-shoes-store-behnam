import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/features/products/components/product-grid";
import { ProductsContent } from "@/features/products/components/products-content";
import type { RawSearchParams } from "@/features/products/filters";

export const metadata: Metadata = { title: "محصولات" };

function PageSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="bg-surface h-9 w-56 animate-pulse rounded-full motion-reduce:animate-none" />
      <div className="bg-surface mt-5 h-10 w-full animate-pulse rounded-full motion-reduce:animate-none" />
      <div className="mt-6">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <Suspense fallback={<PageSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
