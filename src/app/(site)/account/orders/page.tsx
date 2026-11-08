import type { Metadata } from "next";
import { AccountShell } from "@/features/auth/components/account-shell";
import { OrdersContent } from "@/features/orders/components/orders-content";
import { ordersCopy } from "@/features/orders/copy";

export const metadata: Metadata = { title: ordersCopy.title };

export default function OrdersPage() {
  return (
    <AccountShell current="orders" title={ordersCopy.title}>
      <OrdersContent />
    </AccountShell>
  );
}
