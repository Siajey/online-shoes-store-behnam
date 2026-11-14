import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StateMessage } from "@/components/ui/state-message";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { PencilIcon } from "@/features/admin/components/admin-icons";
import { adminProductsCopy as t } from "../copy";
import { ACTION_LABEL, STATUS_BADGE, STATUS_LABEL, allowedActions } from "../status";
import {
  PRODUCT_STATUSES,
  type AdminProduct,
  type ProductStatus,
  type StatusAction,
} from "../types";

/** ستون‌های جدول در صفحه‌ی بزرگ: محصول | قیمت | موجودی | وضعیت | عملیات */
const GRID =
  "lg:grid lg:grid-cols-[minmax(0,2.4fr)_1.4fr_1fr_1fr_minmax(0,1.6fr)] lg:items-center lg:gap-4";

export function priceText(p: Pick<AdminProduct, "minPrice" | "maxPrice">): string {
  if (p.minPrice === null) return t.noPrice;
  if (p.maxPrice === null || p.maxPrice === p.minPrice)
    return formatPrice(p.minPrice, { unit: false });
  return `${formatPrice(p.minPrice, { unit: false })} تا ${formatPrice(p.maxPrice, { unit: false })}`;
}

export type FilterBarProps = {
  status: ProductStatus | undefined;
  onStatus: (status: ProductStatus | undefined) => void;
  query: string;
  onQuery: (value: string) => void;
  onSearch: () => void;
};

const STATUS_OPTIONS = PRODUCT_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }));

export function FilterBar({ status, onStatus, query, onQuery, onSearch }: FilterBarProps) {
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <div className="min-w-48 flex-1">
        <Input label={t.searchLabel} value={query} onChange={(e) => onQuery(e.target.value)} />
      </div>
      <div className="w-full sm:w-48">
        <Select
          label={t.statusLabel}
          options={STATUS_OPTIONS}
          placeholder={t.filterAll}
          value={status ?? ""}
          onChange={(e) => onStatus((e.target.value || undefined) as ProductStatus | undefined)}
        />
      </div>
      <Button type="submit" variant="secondary" className="h-13">
        {t.searchCta}
      </Button>
    </form>
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
    <li className={`flex flex-col gap-3 py-4 ${GRID}`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="bg-surface-2 text-fg-muted flex size-14 flex-none items-center justify-center overflow-hidden rounded-2xl text-[11px]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- تصویر پنل از CDN دلخواه می‌آید
            <img src={image} alt="" className="size-full object-cover" />
          ) : (
            t.noImage
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium">{product.name}</div>
          <div dir="ltr" className="text-fg-muted truncate text-start text-xs">
            {product.slug}
          </div>
        </div>
      </div>
      <div className="text-sm">{priceText(product)}</div>
      <div className="flex flex-col gap-1">
        <Badge size="sm" variant={product.inStock ? "success" : "danger"} className="self-start">
          {product.inStock ? t.inStock : t.outOfStock}
        </Badge>
        <span className="text-fg-muted text-xs">
          {toPersianDigits(product.activeVariantCount)} {t.variants}
        </span>
      </div>
      <div>
        <Badge variant={STATUS_BADGE[product.status]} size="sm">
          {STATUS_LABEL[product.status]}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/admin/products/${product.id}`}
          aria-label={t.editNamed(product.name)}
          title={t.edit}
          className="bg-surface-2 focus-visible:outline-brand flex size-10 items-center justify-center rounded-full hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <PencilIcon />
        </Link>
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

function HeaderRow() {
  const c = t.columns;
  return (
    <div
      aria-hidden="true"
      className={`text-fg-muted border-line hidden border-b pb-3 text-sm ${GRID}`}
    >
      <span>{c.product}</span>
      <span>{c.price}</span>
      <span>{c.stock}</span>
      <span>{c.status}</span>
      <span>{c.actions}</span>
    </div>
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
      <div className="rounded-card bg-surface p-4 lg:p-6">
        <HeaderRow />
        <ul className="divide-line divide-y">
          {state.items.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              busy={busyId === p.id}
              onAction={(a) => onAction(p.id, a)}
            />
          ))}
        </ul>
      </div>
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
