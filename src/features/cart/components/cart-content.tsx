"use client";

import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { cartCopy } from "../copy";
import { cartStore } from "../instance";
import { useCartItems, useCartMeta, useCartReady } from "../use-cart";
import { CartView } from "./cart-view";

function CartSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-3">
      <span className="sr-only">{cartCopy.loading}</span>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className="rounded-card bg-surface h-36 animate-pulse motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

/**
 * صفحه‌ی سبد. تا آماده شدن (خواندن حافظه‌ی مرورگر یا سبد سرور) اسکلت نشان می‌دهد
 * تا «سبد خالی» اشتباهی دیده نشود.
 */
export function CartContent() {
  const ready = useCartReady();
  const items = useCartItems();
  const meta = useCartMeta();
  if (!ready) return <CartSkeleton />;
  // خواندن سبد سرور شکست خورد و چیزی برای نمایش نیست.
  if (meta.mode === "server" && meta.error && items.length === 0) {
    return (
      <StateMessage tone="error">
        <p>{meta.error}</p>
        <Button className="mt-4" onClick={() => void cartStore.retry()}>
          {cartCopy.retry}
        </Button>
      </StateMessage>
    );
  }
  return (
    <CartView
      items={items}
      pending={meta.pending}
      error={meta.error}
      notice={meta.notice}
      onQuantityChange={(id, quantity) => void cartStore.setQuantity(id, quantity)}
      onRemove={(id) => void cartStore.remove(id)}
      onClear={() => void cartStore.clear()}
    />
  );
}
