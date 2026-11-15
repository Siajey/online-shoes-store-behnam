"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { ProductGrid } from "@/features/products/components/product-grid";
import type { Product } from "@/features/products/types";
import { useClientReady } from "@/lib/use-client-ready";
import { favouritesCopy } from "../copy";
import { favouritesStore } from "../instance";
import { useFavourites, useFavouritesList, useFavouritesMeta } from "../use-favourites";

type ViewProps = {
  items: readonly Product[];
  /** توضیح بالای فهرست؛ پیش‌فرض: «فقط در همین مرورگر ذخیره می‌شود» */
  note?: string | null;
  /** اگر صفحه‌ی بعدی هست، دکمه‌ی «نمایش بیشتر» */
  more?: { onClick: () => void; loading: boolean } | null;
};

/** نمای خالص؛ برای تست و استفاده‌ی مجدد. */
export function FavouritesView({ items, note = favouritesCopy.note, more }: ViewProps) {
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
      {note && <p className="text-fg-muted text-sm leading-7">{note}</p>}
      <ProductGrid products={[...items]} />
      {more && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={more.onClick} loading={more.loading}>
            {more.loading ? favouritesCopy.loadingMore : favouritesCopy.loadMore}
          </Button>
        </div>
      )}
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

function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <StateMessage tone="error" className="w-full">
        {message}
      </StateMessage>
      <Button variant="outline" onClick={onRetry}>
        {favouritesCopy.retry}
      </Button>
    </div>
  );
}

/** مهمان: فهرست مرورگر. واردشده: فهرست حساب از سرور، صفحه‌به‌صفحه. */
export function FavouritesContent() {
  const ready = useClientReady();
  const meta = useFavouritesMeta();
  const localItems = useFavourites();
  const list = useFavouritesList();
  const server = meta.mode === "server";

  useEffect(() => {
    if (server && !meta.loading && !meta.error && list.status === "idle") {
      void favouritesStore.loadList();
    }
  }, [server, meta.loading, meta.error, list.status]);

  if (!ready || meta.loading) return <FavouritesSkeleton />;
  if (!server) return <FavouritesView items={localItems} />;
  if (meta.error && list.status !== "ready") {
    return <ErrorBox message={meta.error} onRetry={() => void favouritesStore.retry()} />;
  }
  if (list.status === "error") {
    return (
      <ErrorBox
        message={list.error ?? favouritesCopy.syncError}
        onRetry={() => void favouritesStore.loadList()}
      />
    );
  }
  if (list.status !== "ready") return <FavouritesSkeleton />;
  return (
    <div className="flex flex-col gap-4">
      {meta.notice && (
        <p role="status" className="text-fg-muted text-sm">
          {meta.notice}
        </p>
      )}
      {meta.error && (
        <p role="alert" className="text-danger text-sm">
          {meta.error}
        </p>
      )}
      <FavouritesView
        items={list.items}
        note={null}
        more={
          list.nextCursor
            ? { onClick: () => void favouritesStore.loadMore(), loading: list.loadingMore }
            : null
        }
      />
    </div>
  );
}
