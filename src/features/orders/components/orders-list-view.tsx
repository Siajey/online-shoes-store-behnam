import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { toPersianDigits } from "@/lib/format";
import { ordersCopy as t } from "../copy";
import { formatOrderDate } from "../format";
import type { OrderSummary } from "../types";
import { price, StatusBadge, Thumb } from "./order-parts";

export function OrdersSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-3">
      <span className="sr-only">{t.loading}</span>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className="rounded-card bg-surface h-28 animate-pulse motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

export function OrderCard({ order }: { order: OrderSummary }) {
  return (
    <li className="rounded-card bg-surface flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-medium">
          {t.orderNumber(toPersianDigits(order.orderNumber))}
        </span>
        <StatusBadge status={order.status} />
      </div>
      <div className="flex items-center gap-3">
        <Thumb src={order.imageUrl} alt="" />
        <dl className="grid flex-1 gap-1 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-fg-muted">{t.placedAt}</dt>
            <dd>{formatOrderDate(order.createdAt)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-fg-muted">{t.itemsCount(toPersianDigits(order.itemCount))}</dt>
            <dd className="font-medium">{price(order.total)}</dd>
          </div>
        </dl>
      </div>
      <Link
        href={`/account/orders/${order.id}`}
        className={buttonVariants({ variant: "outline", size: "sm", className: "self-start" })}
      >
        {t.viewDetail}
      </Link>
    </li>
  );
}

type Props = {
  orders: readonly OrderSummary[];
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

export function OrdersListView({ orders, hasMore, loadingMore, onLoadMore }: Props) {
  if (orders.length === 0) {
    return (
      <StateMessage>
        <p className="text-fg text-base font-medium">{t.empty}</p>
        <p className="mt-1">{t.emptyHint}</p>
        <Link href="/products" className={buttonVariants({ className: "mt-5" })}>
          {t.startShopping}
        </Link>
      </StateMessage>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </ul>
      {hasMore && (
        <Button
          variant="outline"
          className="self-center"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? t.loadingMore : t.loadMore}
        </Button>
      )}
    </div>
  );
}
