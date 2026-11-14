"use client";

import { useEffect, useSyncExternalStore } from "react";
import { cartCount } from "./cart";
import { cartStore } from "./instance";
import type { CartMeta } from "./service";
import type { CartItem } from "./types";

const noopSubscribe = () => () => {};

/** هر استفاده‌کننده‌ی سبد، هم‌گام‌سازی با وضعیت ورود را (فقط یک بار) راه می‌اندازد. */
function useStart() {
  useEffect(() => {
    cartStore.start();
  }, []);
}

/** ردیف‌های سبد. روی سرور و هنگام هیدریت خالی است؛ برای تشخیص آماده‌شدن از useCartReady استفاده کنید. */
export function useCartItems(): readonly CartItem[] {
  useStart();
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
}

/** فقط تعداد کل؛ با تغییر تعداد دوباره رندر می‌شود، نه با هر تغییر دیگری. */
export function useCartCount(): number {
  useStart();
  return useSyncExternalStore(
    cartStore.subscribe,
    () => cartCount(cartStore.getSnapshot()),
    () => 0,
  );
}

/** وضعیت سبد: حالت (مهمان/سرور)، بارگذاری، خطا و پیام. */
export function useCartMeta(): CartMeta {
  useStart();
  return useSyncExternalStore(cartStore.subscribe, cartStore.getMeta, cartStore.getServerMeta);
}

/** روی سرور false، و بعد از هیدریت در مرورگر true. در حال خواندن سبد سرور هم false است. */
export function useCartReady(): boolean {
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const { loading } = useCartMeta();
  return hydrated && !loading;
}
