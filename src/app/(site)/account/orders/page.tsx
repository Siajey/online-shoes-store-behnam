import type { Metadata } from "next";
import { AccountTabs } from "@/features/auth/components/account-tabs";
import { OrdersContent } from "@/features/orders/components/orders-content";
import { ordersCopy } from "@/features/orders/copy";

export const metadata: Metadata = { title: ordersCopy.title };

export default function OrdersPage() {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="mb-6 text-2xl font-semibold lg:text-3xl">{ordersCopy.title}</h1>
      <AccountTabs current="orders" />
      <OrdersContent />
    </main>
  );
}
