import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountShell } from "@/features/auth/components/account-shell";
import { OrderDetailContent } from "@/features/orders/components/order-detail-content";
import { OrdersSkeleton } from "@/features/orders/components/orders-list-view";
import { ordersCopy } from "@/features/orders/copy";

export const metadata: Metadata = { title: ordersCopy.listTitle };

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailContent id={id} />;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AccountShell current="orders" title={ordersCopy.listTitle}>
      <Suspense fallback={<OrdersSkeleton />}>
        <Detail params={params} />
      </Suspense>
    </AccountShell>
  );
}
