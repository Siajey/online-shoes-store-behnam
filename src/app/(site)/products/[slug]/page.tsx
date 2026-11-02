import { Suspense } from "react";
import { ProductDetailContent } from "@/features/products/components/product-detail-content";

function DetailSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="bg-surface h-5 w-64 animate-pulse rounded-full motion-reduce:animate-none" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="bg-surface h-80 animate-pulse rounded-[40px] motion-reduce:animate-none lg:h-120" />
        <div className="flex flex-col gap-5">
          <div className="bg-surface h-10 w-3/4 animate-pulse rounded-full motion-reduce:animate-none" />
          <div className="bg-surface h-8 w-1/2 animate-pulse rounded-full motion-reduce:animate-none" />
          <div className="bg-surface h-13 w-full animate-pulse rounded-full motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <Suspense fallback={<DetailSkeleton />}>
        <ProductDetailContent params={params} />
      </Suspense>
    </main>
  );
}
