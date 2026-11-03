import type { Metadata } from "next";
import { CartContent } from "@/features/cart/components/cart-content";
import { cartCopy } from "@/features/cart/copy";

export const metadata: Metadata = { title: cartCopy.title };

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="mb-6 text-2xl font-semibold lg:text-3xl">{cartCopy.title}</h1>
      <CartContent />
    </main>
  );
}
