import { Suspense } from "react";
import { AdminOrderDetailContent } from "@/features/admin/orders/components/admin-order-detail-content";

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminOrderDetailContent id={id} />;
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <Detail params={params} />
    </Suspense>
  );
}
