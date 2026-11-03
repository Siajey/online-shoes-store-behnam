"use client";

import { useSyncExternalStore } from "react";
import { cartCount } from "./cart";
import { cartStore } from "./store";
import type { CartItem } from "./types";

const noopSubscribe = () => () => {};

/** ردیف‌های سبد. روی سرور و هنگام هیدریت خالی است؛ برای تشخیص آماده‌شدن از useCartReady استفاده کنید. */
export function useCartItems(): readonly CartItem[] {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
}

/** فقط تعداد کل؛ با تغییر تعداد دوباره رندر می‌شود، نه با هر تغییر دیگری. */
export function useCartCount(): number {
  return useSyncExternalStore(
    cartStore.subscribe,
    () => cartCount(cartStore.getSnapshot()),
    () => 0,
  );
}

/** روی سرور false، و بعد از هیدریت در مرورگر true. برای نشان ندادن «سبد خالی» پیش از خواندن حافظه. */
export function useCartReady(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
