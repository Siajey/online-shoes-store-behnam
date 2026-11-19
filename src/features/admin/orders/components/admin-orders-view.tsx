import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StateMessage } from "@/components/ui/state-message";
import { StatusBadge, price } from "@/features/orders/components/order-parts";
import { formatOrderDateTime } from "@/features/orders/format";
import { statusLabel } from "@/features/orders/status";
import { ORDER_STATUSES, type OrderStatus, type OrderSummary } from "@/features/orders/types";
import { toPersianDigits } from "@/lib/format";
import { adminOrdersCopy as t } from "../copy";

const STATUS_OPTIONS = ORDER_STATUSES.map((s) => ({ value: s, label: statusLabel(s) }));

export type OrdersFilterProps = {
  status: OrderStatus | undefined;
  orderNumber: string;
  from: string;
  to: string;
  error?: string;
  onStatus: (v: OrderStatus | undefined) => void;
  onOrderNumber: (v: string) => void;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export function OrdersFilterBar(p: OrdersFilterProps) {
  const dirty = Boolean(p.status || p.orderNumber || p.from || p.to);
  return (
    <form
      className="flex flex-wrap items-start gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        p.onSearch();
      }}
    >
      <div className="w-full sm:w-48">
        <Select
          label={t.statusLabel}
          options={STATUS_OPTIONS}
          placeholder={t.all}
          value={p.status ?? ""}
          onChange={(e) => p.onStatus((e.target.value || undefined) as OrderStatus | undefined)}
        />
      </div>
      <div className="w-full sm:w-44">
        <Input
          label={t.orderNumberLabel}
          ltr
          inputMode="numeric"
          value={p.orderNumber}
          error={p.error}
          onChange={(e) => p.onOrderNumber(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-44">
        <Input
          label={t.fromLabel}
          ltr
          type="date"
          value={p.from}
          onChange={(e) => p.onFrom(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-44">
        <Input
          label={t.toLabel}
          ltr
          type="date"
          value={p.to}
          onChange={(e) => p.onTo(e.target.value)}
        />
      </div>
      <Button type="submit" variant="secondary" className="mt-7 h-13">
        {t.searchCta}
      </Button>
      {dirty && (
        <Button type="button" variant="ghost" className="mt-7 h-13" onClick={p.onClear}>
          {t.clear}
        </Button>
      )}
    </form>
  );
}

const GRID = "lg:grid lg:grid-cols-[1fr_1.4fr_1.4fr_1.2fr_1fr_auto] lg:items-center lg:gap-4";

export type OrdersListViewProps = {
  state:
    | { status: "loading" }
    | { status: "error"; message: string; onRetry: () => void }
    | { status: "ready"; items: readonly OrderSummary[]; hasMore: boolean };
  loadingMore: boolean;
  onLoadMore: () => void;
};

export function AdminOrdersListView({ state, loadingMore, onLoadMore }: OrdersListViewProps) {
  if (state.status === "loading") {
    return (
      <div role="status" aria-busy="true" className="grid gap-3">
        <span className="sr-only">{t.loading}</span>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            aria-hidden="true"
            className="rounded-card bg-surface h-16 animate-pulse motion-reduce:animate-none"
          />
        ))}
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <StateMessage tone="error">
        <p>{state.message}</p>
        <Button className="mt-4" variant="secondary" onClick={state.onRetry}>
          {t.retry}
        </Button>
      </StateMessage>
    );
  }
  if (state.items.length === 0) return <StateMessage>{t.empty}</StateMessage>;
  return (
    <div className="flex flex-col gap-3">
      <div aria-hidden="true" className={`text-fg-muted hidden px-5 text-xs ${GRID}`}>
        <span>{t.columns.order}</span>
        <span>{t.columns.customer}</span>
        <span>{t.columns.date}</span>
        <span>{t.columns.total}</span>
        <span>{t.columns.status}</span>
        <span />
      </div>
      <ul className="flex flex-col gap-2">
        {state.items.map((o) => (
          <li
            key={o.id}
            className={`rounded-card bg-surface flex flex-col gap-2 p-4 text-sm ${GRID}`}
          >
            <span className="font-medium">{toPersianDigits(o.orderNumber)}</span>
            <span className="truncate">{o.customer ?? "—"}</span>
            <span className="text-fg-secondary">{formatOrderDateTime(o.createdAt)}</span>
            <span>{price(o.total)}</span>
            <span>
              <StatusBadge status={o.status} />
            </span>
            <Link
              href={`/admin/orders/${o.id}`}
              className="text-brand underline underline-offset-4"
            >
              {t.view}
            </Link>
          </li>
        ))}
      </ul>
      {state.hasMore && (
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
