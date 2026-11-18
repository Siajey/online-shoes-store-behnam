"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { placeOrder } from "./api";
import { classifyPlaceOrderError, needsFreshKey, type PlaceOrderFailure } from "./errors";
import { newIdempotencyKey } from "./idempotency";

export type PlaceOrderState =
  { status: "idle" } | { status: "placing" } | { status: "failed"; failure: PlaceOrderFailure };

/**
 * ثبت سفارش از تسویه. کلید idempotency بین تلاش‌های دوباره‌ی «همان درخواست» (مثلاً قطع شبکه)
 * ثابت می‌ماند تا سفارش دوبار ساخته نشود؛ فقط وقتی سرور درخواست را رد کرده یا آدرس عوض شده تازه می‌شود.
 */
export function usePlaceOrder() {
  const router = useRouter();
  const [state, setState] = useState<PlaceOrderState>({ status: "idle" });
  const keyRef = useRef<{ key: string; addressId: string } | null>(null);
  const busy = useRef(false);

  const place = useCallback(
    async (addressId: string, expectedTotal?: number) => {
      if (busy.current) return;
      busy.current = true;
      setState({ status: "placing" });
      if (!keyRef.current || keyRef.current.addressId !== addressId) {
        keyRef.current = { key: newIdempotencyKey(), addressId };
      }
      try {
        const order = await placeOrder({
          addressId,
          idempotencyKey: keyRef.current.key,
          expectedTotal,
        });
        keyRef.current = null;
        router.push(`/account/orders/${order.id}?placed=1`);
      } catch (e) {
        const failure = classifyPlaceOrderError(e);
        if (needsFreshKey(failure)) keyRef.current = null;
        setState({ status: "failed", failure });
      } finally {
        busy.current = false;
      }
    },
    [router],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);
  return { state, place, reset };
}
