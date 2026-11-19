import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, Thumb, price } from "@/features/orders/components/order-parts";
import { formatOrderDateTime } from "@/features/orders/format";
import { statusLabel } from "@/features/orders/status";
import type { OrderDetail } from "@/features/orders/types";
import { toPersianDigits } from "@/lib/format";
import { adminActionsFor, type ActionDraft, type AdminOrderActionKind } from "../actions";
import { adminOrdersCopy as t } from "../copy";

export type DetailViewProps = {
  order: OrderDetail;
  selected: AdminOrderActionKind | null;
  draft: ActionDraft;
  submitting: boolean;
  message: { tone: "error" | "ok"; text: string } | null;
  onSelect: (a: AdminOrderActionKind | null) => void;
  onDraft: (patch: Partial<ActionDraft>) => void;
  onSubmit: () => void;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-card bg-surface flex flex-col gap-3 p-5">
    <h2 className="text-base font-medium">{title}</h2>
    {children}
  </section>
);

export function AdminOrderDetailView(p: DetailViewProps) {
  const { order } = p;
  const actions = adminActionsFor(order.status);
  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/admin/orders"
        className="text-brand self-start text-sm underline underline-offset-4"
      >
        {t.back}
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium">{toPersianDigits(order.orderNumber)}</h2>
          <StatusBadge status={order.status} />
        </div>
        <span className="text-fg-muted text-sm">{formatOrderDateTime(order.createdAt)}</span>
      </div>

      <Section title={t.actionsTitle}>
        {actions.length === 0 ? (
          <p className="text-fg-muted text-sm">{t.noActions}</p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {actions.map((a) => (
                <Button
                  key={a}
                  size="sm"
                  variant={p.selected === a ? "secondary" : "outline"}
                  onClick={() => p.onSelect(p.selected === a ? null : a)}
                  disabled={p.submitting}
                >
                  {t.action[a]}
                </Button>
              ))}
            </div>
            {p.selected && (
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  p.onSubmit();
                }}
              >
                {p.selected === "cancel" && (
                  <p className="text-danger text-sm">{t.confirmCancel}</p>
                )}
                {p.selected === "ship" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label={t.carrierLabel}
                      value={p.draft.carrier}
                      onChange={(e) => p.onDraft({ carrier: e.target.value })}
                    />
                    <Input
                      label={t.trackingLabel}
                      ltr
                      value={p.draft.trackingCode}
                      onChange={(e) => p.onDraft({ trackingCode: e.target.value })}
                    />
                  </div>
                )}
                <Input
                  label={t.noteLabel}
                  value={p.draft.note}
                  onChange={(e) => p.onDraft({ note: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={p.submitting}>
                    {p.submitting ? t.submitting : t.submit}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => p.onSelect(null)}
                    disabled={p.submitting}
                  >
                    {t.cancelForm}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
        {p.message && (
          <p
            role={p.message.tone === "error" ? "alert" : "status"}
            className={`${p.message.tone === "error" ? "text-danger" : "text-ok"} text-sm`}
          >
            {p.message.text}
          </p>
        )}
      </Section>

      <Section title={t.items}>
        <ul className="divide-line flex flex-col divide-y">
          {order.lines.map((l) => (
            <li key={l.variantId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Thumb src={l.imageUrl} alt={l.name} />
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                <span className="truncate font-medium">{l.name}</span>
                {l.variantLabel && <span className="text-fg-muted text-xs">{l.variantLabel}</span>}
                {l.sku && (
                  <span dir="ltr" className="text-fg-muted text-start text-xs">
                    {l.sku}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 text-sm">
                <span className="text-fg-muted text-xs">
                  {toPersianDigits(l.quantity)} × {price(l.unitPrice)}
                </span>
                <span className="font-medium">{price(l.lineTotal)}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-line flex justify-between border-t pt-3 text-base font-medium">
          <span>مبلغ نهایی</span>
          <span>{price(order.totals.total)}</span>
        </div>
      </Section>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title={t.customer}>
          <div className="text-sm leading-7">
            <p className="font-medium">{order.recipient.name}</p>
            {order.recipient.phone && (
              <p dir="ltr" className="text-fg-secondary text-end">
                {toPersianDigits(order.recipient.phone)}
              </p>
            )}
            <p className="text-fg-secondary mt-2">
              {order.address.province}، {order.address.city}، {order.address.street}
            </p>
            <p className="text-fg-muted">{toPersianDigits(order.address.postalCode)}</p>
          </div>
          {(order.carrier || order.trackingCode) && (
            <p className="border-line border-t pt-3 text-sm">
              {order.carrier} {order.trackingCode && `· ${toPersianDigits(order.trackingCode)}`}
            </p>
          )}
        </Section>
        <Section title="تاریخچه">
          <ol className="flex flex-col gap-3 text-sm">
            {order.timeline.map((e, i) => (
              <li key={`${e.status}-${e.at}-${i}`} className="flex flex-col gap-0.5">
                <span className="flex justify-between gap-2">
                  <span className="font-medium">{statusLabel(e.status)}</span>
                  <span className="text-fg-muted text-xs">{formatOrderDateTime(e.at)}</span>
                </span>
                {e.note && <span className="text-fg-secondary text-xs">{e.note}</span>}
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}
