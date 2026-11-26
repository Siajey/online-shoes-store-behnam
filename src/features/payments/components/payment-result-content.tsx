"use client";

import { useSearchParams } from "next/navigation";
import { StateMessage } from "@/components/ui/state-message";
import { authStore } from "@/features/auth/auth-store";
import { AccountError } from "@/features/auth/components/account-views";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { paymentsCopy as t } from "../copy";
import { parseResultParams } from "../result";
import { usePaymentResult } from "../use-payment-result";
import { useStartPayment } from "../use-start-payment";
import { PaymentResultView } from "./payment-result-view";

/** صفحه‌ی برگشت از درگاه. باید داخل Suspense باشد (useSearchParams). */
export function PaymentResultContent() {
  const search = useSearchParams();
  const params = parseResultParams((k) => search.get(k));
  const auth = useRequireAuth(`/payment/result?${search.toString()}`);
  const authed = auth.status === "authenticated";
  const { state, recheck } = usePaymentResult(params, authed);
  const start = useStartPayment();

  if (auth.status === "error") {
    return <AccountError message={auth.error} onRetry={() => void authStore.refresh()} />;
  }
  if (!authed && params.status !== "invalid") {
    return <StateMessage>{t.result.verifying}</StateMessage>;
  }

  // شناسه‌ی سفارش را از خود سرور (پرداخت) بگیر؛ پارامتر آدرس فقط جایگزین است.
  const orderId = "payment" in state ? state.payment.orderId : params.orderId;
  return (
    <PaymentResultView
      state={state}
      orderId={orderId}
      onRecheck={recheck}
      onPayAgain={() => orderId && void start.pay(orderId)}
      paying={start.state.status === "starting"}
      payError={start.state.status === "failed" ? start.state.message : undefined}
    />
  );
}
