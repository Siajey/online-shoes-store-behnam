"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { ProductGrid } from "@/features/products/components/product-grid";
import type { Product } from "@/features/products/types";
import { useClientReady } from "@/lib/use-client-ready";
import { favouritesCopy } from "../copy";
import { useFavourites } from "../use-favourites";

/** نمای خالص؛ برای تست و استفاده‌ی مجدد. */
export function FavouritesView({ items }: { items: readonly Product[] }) {
  if (items.length === 0) {
    return (
      <StateMessage>
        <p className="text-fg text-base font-medium">{favouritesCopy.empty}</p>
        <p className="mt-1">{favouritesCopy.emptyHint}</p>
        <Link href="/products" className={buttonVariants({ className: "mt-5" })}>
          {favouritesCopy.startShopping}
        </Link>
      </StateMessage>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-fg-muted text-sm leading-7">{favouritesCopy.note}</p>
      <ProductGrid products={[...items]} />
    </div>
  );
}

function FavouritesSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">{favouritesCopy.loading}</span>
      <div aria-hidden="true" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-card bg-surface h-80 animate-pulse motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}

/** تا خواندن حافظه‌ی مرورگر اسکلت نشان می‌دهد تا «خالی» اشتباهی دیده نشود. */
export function FavouritesContent() {
  const ready = useClientReady();
  const items = useFavourites();
  if (!ready) return <FavouritesSkeleton />;
  return <FavouritesView items={items} />;
}
