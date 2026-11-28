"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { beginPayment } from "@/features/payments/api";
import { placeOrder } from "./api";
import { classifyPlaceOrderError, needsFreshKey, type PlaceOrderFailure } from "./errors";
import { newIdempotencyKey } from "./idempotency";

export type PlaceOrderState =
  | { status: "idle" }
  | { status: "placing" }
  | { status: "redirecting" }
  | { status: "failed"; failure: PlaceOrderFailure };

/**
 * ثبت سفارش از تسویه. کلید idempotency بین تلاش‌های دوباره‌ی «همان درخواست» (مثلاً قطع شبکه)
 * ثابت می‌ماند تا سفارش دوبار ساخته نشود؛ فقط وقتی سرور درخواست را رد کرده یا آدرس/روش ارسال عوض شده تازه می‌شود.
 */
export function usePlaceOrder() {
  const router = useRouter();
  const [state, setState] = useState<PlaceOrderState>({ status: "idle" });
  const keyRef = useRef<{ key: string; addressId: string; shippingMethod: string } | null>(null);
  const busy = useRef(false);
  const placedId = useRef<string | null>(null);

  // برگشت با دکمه‌ی back از درگاه: سفارش ساخته شده؛ کاربر را به صفحه‌ی سفارش ببر که دکمه‌ی پرداخت دارد.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted && placedId.current)
        router.replace(`/account/orders/${placedId.current}?placed=1`);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, [router]);

  const place = useCallback(
    async (addressId: string, shippingMethod: string, expectedTotal?: number) => {
      if (busy.current) return;
      busy.current = true;
      setState({ status: "placing" });
      if (
        !keyRef.current ||
        keyRef.current.addressId !== addressId ||
        keyRef.current.shippingMethod !== shippingMethod
      ) {
        keyRef.current = { key: newIdempotencyKey(), addressId, shippingMethod };
      }
      try {
        const order = await placeOrder({
          addressId,
          shippingMethod,
          idempotencyKey: keyRef.current.key,
          expectedTotal,
        });
        keyRef.current = null;
        placedId.current = order.id;
        setState({ status: "redirecting" });
        try {
          await beginPayment(order.id);
          // مرورگر به درگاه می‌رود؛ حالت «redirecting» می‌ماند.
          return;
        } catch {
          // سفارش ساخته شده؛ پرداخت را از صفحه‌ی سفارش دوباره امتحان می‌کند.
          router.push(`/account/orders/${order.id}?placed=1&pay=failed`);
          return;
        }
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
