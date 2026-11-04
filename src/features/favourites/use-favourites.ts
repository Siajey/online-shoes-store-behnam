"use client";

import { useSyncExternalStore } from "react";
import type { Product } from "@/features/products/types";
import { favouritesStore } from "./store";

/** لیست علاقه‌مندی‌ها؛ روی سرور و هنگام هیدریت خالی است. */
export function useFavourites(): readonly Product[] {
  return useSyncExternalStore(
    favouritesStore.subscribe,
    favouritesStore.getSnapshot,
    favouritesStore.getServerSnapshot,
  );
}

/** آیا این محصول علاقه‌مندی است؟ فقط وقتی جواب همین محصول عوض شود دوباره رندر می‌شود. */
export function useIsFavourite(id: string): boolean {
  return useSyncExternalStore(
    favouritesStore.subscribe,
    () => favouritesStore.getSnapshot().some((p) => p.id === id),
    () => false,
  );
}
