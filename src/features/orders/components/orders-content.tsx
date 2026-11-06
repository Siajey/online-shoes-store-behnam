"use client";

import { useRequireAuth } from "@/features/auth/use-require-auth";
import { ordersCopy } from "../copy";
import { OrdersSoonView } from "./orders-views";

/** صفحه‌ی سفارش‌ها: مهمان به /login می‌رود. ☐ با آماده شدن API سفارش، فهرست واقعی جایگزین شود. */
export function OrdersContent() {
  const auth = useRequireAuth("/account/orders");
  if (auth.status !== "authenticated") {
    return (
      <div role="status" aria-busy="true">
        <span className="sr-only">{ordersCopy.loading}</span>
        <div
          aria-hidden="true"
          className="rounded-card bg-surface h-40 animate-pulse motion-reduce:animate-none"
        />
      </div>
    );
  }
  return <OrdersSoonView />;
}
