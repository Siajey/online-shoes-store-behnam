"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Product } from "@/features/products/types";
import { favouritesStore } from "./instance";
import type { FavouritesList, FavouritesMeta } from "./service";

/** هر استفاده‌کننده، هم‌گام‌سازی با وضعیت ورود را (فقط یک بار) راه می‌اندازد. */
function useStart() {
  useEffect(() => {
    favouritesStore.start();
  }, []);
}

/** علاقه‌مندی‌های مرورگر (مهمان). برای فهرست حساب از useFavouritesList استفاده کنید. */
export function useFavourites(): readonly Product[] {
  useStart();
  return useSyncExternalStore(
    favouritesStore.subscribe,
    favouritesStore.getItems,
    favouritesStore.getServerItems,
  );
}

/** مجموعه‌ی شناسه‌ی علاقه‌مندی‌ها (مهمان: مرورگر، واردشده: سرور). */
export function useFavouriteIds(): ReadonlySet<string> {
  useStart();
  return useSyncExternalStore(
    favouritesStore.subscribe,
    favouritesStore.getIds,
    favouritesStore.getServerIds,
  );
}

/** آیا این محصول علاقه‌مندی است؟ فقط وقتی جواب همین محصول عوض شود دوباره رندر می‌شود. */
export function useIsFavourite(id: string): boolean {
  useStart();
  return useSyncExternalStore(
    favouritesStore.subscribe,
    () => favouritesStore.getIds().has(id),
    () => false,
  );
}

export function useFavouritesMeta(): FavouritesMeta {
  useStart();
  return useSyncExternalStore(
    favouritesStore.subscribe,
    favouritesStore.getMeta,
    favouritesStore.getServerMeta,
  );
}

export function useFavouritesList(): FavouritesList {
  useStart();
  return useSyncExternalStore(
    favouritesStore.subscribe,
    favouritesStore.getList,
    favouritesStore.getServerList,
  );
}
