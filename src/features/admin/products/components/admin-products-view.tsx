import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StateMessage } from "@/components/ui/state-message";
import { cn } from "@/lib/cn";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { adminProductsCopy as t } from "../copy";
import { ACTION_LABEL, STATUS_BADGE, STATUS_LABEL, allowedActions } from "../status";
import {
  PRODUCT_STATUSES,
  type AdminProduct,
  type ProductStatus,
  type StatusAction,
} from "../types";

export function priceText(p: Pick<AdminProduct, "minPrice" | "maxPrice">): string {
  if (p.minPrice === null) return t.noPrice;
  if (p.maxPrice === null || p.maxPrice === p.minPrice) return formatPrice(p.minPrice);
  return `${formatPrice(p.minPrice, { unit: false })} تا ${formatPrice(p.maxPrice)}`;
}

export type FilterBarProps = {
  status: ProductStatus | undefined;
  onStatus: (status: ProductStatus | undefined) => void;
  query: string;
  onQuery: (value: string) => void;
  onSearch: () => void;
};

export function FilterBar({ status, onStatus, query, onQuery, onSearch }: FilterBarProps) {
  const chips: { value: ProductStatus | undefined; label: string }[] = [
    { value: undefined, label: t.filterAll },
    ...PRODUCT_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
  ];
  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="وضعیت" className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            aria-pressed={status === chip.value}
            onClick={() => onStatus(chip.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm",
              status === chip.value ? "bg-brand text-on-brand" : "bg-surface text-fg-secondary",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <form
        className="flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <div className="flex-1">
          <Input label={t.searchLabel} value={query} onChange={(e) => onQuery(e.target.value)} />
        </div>
        <Button type="submit" variant="secondary" className="h-13">
          {t.searchCta}
        </Button>
      </form>
    </div>
  );
}

export type RowProps = {
  product: AdminProduct;
  busy: boolean;
  onAction: (action: StatusAction) => void;
};

export function ProductRow({ product, busy, onAction }: RowProps) {
  const image = mediaUrl(product.imageKey);
  return (
    <li className="rounded-card bg-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="bg-surface-2 text-fg-muted flex size-16 flex-none items-center justify-center overflow-hidden rounded-2xl text-[11px]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- تصویر پنل از CDN دلخواه می‌آید
          <img src={image} alt="" className="size-full object-cover" />
        ) : (
          t.noImage
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{product.name}</span>
          <Badge variant={STATUS_BADGE[product.status]} size="sm">
            {STATUS_LABEL[product.status]}
          </Badge>
        </div>
        <div className="text-fg-muted mt-1 text-sm">
          {priceText(product)} · {product.inStock ? t.inStock : t.outOfStock} ·{" "}
          {toPersianDigits(product.activeVariantCount)} {t.variants}
        </div>
        <div dir="ltr" className="text-fg-muted mt-1 text-start text-xs">
          {product.slug}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {allowedActions(product.status).map((action) => (
          <Button
            key={action}
            size="sm"
            variant={action === "archive" ? "outline" : "secondary"}
            disabled={busy}
            onClick={() => onAction(action)}
          >
            {ACTION_LABEL[action]}
          </Button>
        ))}
      </div>
    </li>
  );
}

export type ListViewProps = {
  state:
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; items: AdminProduct[]; hasMore: boolean };
  busyId: string | null;
  actionError?: string;
  loadingMore: boolean;
  onAction: (id: string, action: StatusAction) => void;
  onRetry: () => void;
  onLoadMore: () => void;
};

export function ProductListView({
  state,
  busyId,
  actionError,
  loadingMore,
  onAction,
  onRetry,
  onLoadMore,
}: ListViewProps) {
  if (state.status === "loading") {
    return <StateMessage>{t.loading}</StateMessage>;
  }
  if (state.status === "error") {
    return (
      <div className="flex flex-col items-center gap-4">
        <StateMessage tone="error" className="w-full">
          {state.message}
        </StateMessage>
        <Button variant="secondary" onClick={onRetry}>
          {t.retry}
        </Button>
      </div>
    );
  }
  if (state.items.length === 0) return <StateMessage>{t.empty}</StateMessage>;
  return (
    <div className="flex flex-col gap-4">
      {actionError && <StateMessage tone="error">{actionError}</StateMessage>}
      <ul className="flex flex-col gap-3">
        {state.items.map((p) => (
          <ProductRow
            key={p.id}
            product={p}
            busy={busyId === p.id}
            onAction={(a) => onAction(p.id, a)}
          />
        ))}
      </ul>
      {state.hasMore && (
        <Button
          variant="outline"
          disabled={loadingMore}
          onClick={onLoadMore}
          className="self-center"
        >
          {t.loadMore}
        </Button>
      )}
    </div>
  );
}
