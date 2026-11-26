import type { Metadata } from "next";
import { Suspense } from "react";
import { StateMessage } from "@/components/ui/state-message";
import { PaymentResultContent } from "@/features/payments/components/payment-result-content";
import { paymentsCopy } from "@/features/payments/copy";

export const metadata: Metadata = {
  title: paymentsCopy.result.pageTitle,
  robots: { index: false },
};

/** بک‌اند بعد از پرداخت به این آدرس برمی‌گرداند (PAYMENT_RESULT_URL در تنظیمات بک‌اند). */
export default function PaymentResultPage() {
  return (
    <main className="mx-auto w-full max-w-160 px-4 py-10">
      <Suspense fallback={<StateMessage>{paymentsCopy.result.verifying}</StateMessage>}>
        <PaymentResultContent />
      </Suspense>
    </main>
  );
}
