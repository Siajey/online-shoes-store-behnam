"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { beginPayment } from "./api";
import { paymentMessage } from "./errors";

export type StartPaymentState =
  { status: "idle" } | { status: "starting" } | { status: "failed"; message: string };

/** دکمه‌ی «پرداخت»: پرداخت را شروع می‌کند و کاربر را به درگاه می‌برد. دوبار کلیک نادیده گرفته می‌شود. */
export function useStartPayment() {
  const [state, setState] = useState<StartPaymentState>({ status: "idle" });
  const busy = useRef(false);

  const pay = useCallback(async (orderId: string) => {
    if (busy.current) return;
    busy.current = true;
    setState({ status: "starting" });
    try {
      await beginPayment(orderId);
      // مرورگر در حال رفتن به درگاه است؛ حالت «starting» می‌ماند.
    } catch (e) {
      busy.current = false;
      setState({ status: "failed", message: paymentMessage(e) });
    }
  }, []);

  // برگشت با دکمه‌ی back از درگاه (bfcache): دکمه دوباره فعال شود.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      busy.current = false;
      setState({ status: "idle" });
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  return { state, pay };
}
