import type { Metadata } from "next";
import { CheckoutContent } from "@/features/checkout/components/checkout-content";
import { checkoutCopy } from "@/features/checkout/copy";

export const metadata: Metadata = {
  title: checkoutCopy.title,
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="mb-6 text-2xl font-semibold lg:text-3xl">{checkoutCopy.title}</h1>
      <CheckoutContent />
    </main>
  );
}
