"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchPayment } from "./api";
import { paymentsCopy as t } from "./copy";
import { paymentMessage } from "./errors";
import { nextStep, POLL_MS, type ResultParams, type ResultState } from "./result";

/**
 * وضعیت واقعی پرداخت را از سرور می‌پرسد (نه از پارامترهای برگشت) و تا نهایی شدن
 * یا پایان مهلت هر چند ثانیه دوباره می‌پرسد. enabled: بعد از ورود کاربر true می‌شود.
 */
export function usePaymentResult(params: ResultParams, enabled: boolean) {
  const [state, setState] = useState<ResultState>({ kind: "verifying" });
  const [reloadKey, setReloadKey] = useState(0);
  const { paymentId } = params;
  const invalid = params.status === "invalid" || !paymentId;

  useEffect(() => {
    if (!enabled || invalid || !paymentId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = async (attempt: number) => {
      try {
        const payment = await fetchPayment(paymentId);
        if (cancelled) return;
        const step = nextStep(payment, attempt);
        setState(step);
        if (step.kind === "waiting") timer = setTimeout(() => void tick(attempt + 1), POLL_MS);
      } catch (e) {
        if (!cancelled) setState({ kind: "error", message: paymentMessage(e, t.errors.verify) });
      }
    };
    void tick(0);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [enabled, invalid, paymentId, reloadKey]);

  const recheck = useCallback(() => {
    setState({ kind: "verifying" });
    setReloadKey((k) => k + 1);
  }, []);

  const view: ResultState = invalid ? { kind: "invalid" } : state;
  return { state: view, recheck };
}
