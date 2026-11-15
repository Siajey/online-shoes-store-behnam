import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StateMessage } from "@/components/ui/state-message";
import { offerCopyOf, offerCopy as c } from "../copy";
import type { OfferRow } from "../format";
import type { OfferKind } from "../types";

const GRID =
  "lg:grid lg:grid-cols-[minmax(0,2fr)_1fr_1.2fr_1.6fr_.8fr_minmax(0,2.2fr)] lg:items-center lg:gap-4";

export type OffersListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: OfferRow[]; hasMore: boolean };

export type ActiveFilter = "all" | "active" | "inactive";

type Props = {
  kind: OfferKind;
  state: OffersListState;
  filter: ActiveFilter;
  newHref: string;
  editHref: (id: string) => string;
  busyId: string | null;
  confirmingId: string | null;
  actionError?: string;
  loadingMore: boolean;
  onFilter: (f: ActiveFilter) => void;
  onToggle: (id: string) => void;
  onAskDelete: (id: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
};

const FILTERS = [
  { value: "active", label: c.active },
  { value: "inactive", label: c.inactive },
];

function Row({ row, p }: { row: OfferRow; p: Props }) {
  const busy = p.busyId === row.id;
  const confirming = p.confirmingId === row.id;
  return (
    <li className={`flex flex-col gap-2 py-4 ${GRID}`}>
      <div className="min-w-0">
        <p className="truncate font-medium">{row.title}</p>
        {row.code && (
          <p dir="ltr" className="text-fg-muted text-start text-xs">
            {row.code}
          </p>
        )}
      </div>
      <div className="text-sm">{row.value}</div>
      <div className="text-fg-secondary text-sm">{row.scope}</div>
      <div className="text-fg-muted text-sm">{row.period}</div>
      <div>
        <Badge variant={row.active ? "success" : "neutral"} size="sm">
          {row.active ? c.active : c.inactive}
        </Badge>
      </div>
      {confirming ? (
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label={offerCopyOf(p.kind).deleteConfirm}
        >
          <span className="text-danger text-sm">{offerCopyOf(p.kind).deleteConfirm}</span>
          <Button size="sm" variant="danger" disabled={busy} onClick={p.onConfirmDelete}>
            {c.confirmYes}
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={p.onCancelDelete}>
            {c.cancel}
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Link
            href={p.editHref(row.id)}
            className={buttonVariants({ size: "sm", variant: "secondary" })}
          >
            {c.edit}
          </Link>
          <Button size="sm" variant="secondary" disabled={busy} onClick={() => p.onToggle(row.id)}>
            {row.active ? c.disable : c.enable}
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => p.onAskDelete(row.id)}>
            {c.remove}
          </Button>
        </div>
      )}
    </li>
  );
}

function HeaderRow() {
  const k = c.columns;
  return (
    <div
      aria-hidden="true"
      className={`text-fg-muted border-line hidden border-b pb-3 text-sm ${GRID}`}
    >
      <span>{k.name}</span>
      <span>{k.value}</span>
      <span>{k.scope}</span>
      <span>{k.period}</span>
      <span>{k.status}</span>
      <span>{k.actions}</span>
    </div>
  );
}

/** نمای خالص فهرست تخفیف‌ها یا کوپن‌ها. */
export function OffersListView(p: Props) {
  const copy = offerCopyOf(p.kind);
  return (
    <section aria-label={copy.title} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-fg-secondary max-w-xl text-sm leading-7">{copy.intro}</p>
        <div className="flex items-end gap-3">
          <div className="w-40">
            <Select
              label={c.statusFilter}
              options={FILTERS}
              placeholder={c.all}
              value={p.filter === "all" ? "" : p.filter}
              onChange={(e) => p.onFilter((e.target.value || "all") as ActiveFilter)}
            />
          </div>
          <Link href={p.newHref} className={buttonVariants({ className: "h-13" })}>
            {copy.create}
          </Link>
        </div>
      </div>

      {p.state.status === "loading" && (
        <div role="status" aria-busy="true" className="flex flex-col gap-3">
          <span className="sr-only">{c.loading}</span>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              aria-hidden="true"
              className="rounded-card bg-surface h-16 animate-pulse motion-reduce:animate-none"
            />
          ))}
        </div>
      )}
      {p.state.status === "error" && (
        <div className="flex flex-col items-center gap-4">
          <StateMessage tone="error" className="w-full">
            {p.state.message}
          </StateMessage>
          <Button variant="outline" onClick={p.onRetry}>
            {c.retry}
          </Button>
        </div>
      )}
      {p.state.status === "ready" &&
        (p.state.items.length === 0 ? (
          <StateMessage>{copy.empty}</StateMessage>
        ) : (
          <div className="rounded-card bg-surface p-5">
            <HeaderRow />
            <ul className="divide-line divide-y">
              {p.state.items.map((row) => (
                <Row key={row.id} row={row} p={p} />
              ))}
            </ul>
            {p.state.hasMore && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" loading={p.loadingMore} onClick={p.onLoadMore}>
                  {c.loadMore}
                </Button>
              </div>
            )}
          </div>
        ))}
      {p.actionError && (
        <p role="alert" className="text-danger text-sm">
          {p.actionError}
        </p>
      )}
    </section>
  );
}
