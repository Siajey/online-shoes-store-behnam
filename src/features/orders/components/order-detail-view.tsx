import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/format";
import { ordersCopy as t } from "../copy";
import { formatOrderDate, formatOrderDateTime } from "../format";
import { canCancel, statusLabel } from "../status";
import type { OrderDetail } from "../types";
import { price, StatusBadge, Thumb } from "./order-parts";

type Props = {
  order: OrderDetail;
  cancelling: boolean;
  confirmingCancel: boolean;
  actionError: string | null;
  onAskCancel: () => void;
  onAbortCancel: () => void;
  onConfirmCancel: () => void;
  onRefresh: () => void;
  /** شروع پرداخت آنلاین؛ اگر نباشد دکمه غیرفعال است. */
  onPay?: () => void;
  paying?: boolean;
  payError?: string | null;
  /** بعد از ثبت سفارش، اتصال به درگاه ناموفق بود. */
  payNotice?: boolean;
  /** بعد از ثبت سفارش از تسویه، بالای صفحه تبریک نشان داده می‌شود. */
  justPlaced?: boolean;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-card bg-surface flex flex-col gap-3 p-5">
    <h2 className="text-base font-medium">{title}</h2>
    {children}
  </section>
);

const Row = ({ label, value, tone }: { label: string; value: React.ReactNode; tone?: string }) => (
  <div className={`flex justify-between gap-2 ${tone ?? ""}`}>
    <dt className={tone ? "" : "text-fg-muted"}>{label}</dt>
    <dd>{value}</dd>
  </div>
);

export function OrderDetailView({
  order,
  cancelling,
  confirmingCancel,
  actionError,
  onAskCancel,
  onAbortCancel,
  onConfirmCancel,
  onRefresh,
  justPlaced = false,
  onPay,
  paying = false,
  payError = null,
  payNotice = false,
}: Props) {
  const { totals } = order;
  return (
    <div className="flex flex-col gap-5">
      {justPlaced && (
        <div role="status" className="rounded-card bg-surface-2 text-ok p-4 text-sm">
          <p className="font-medium">{t.placed.title}</p>
          <p className="text-fg-secondary mt-1">{t.placed.hint}</p>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium">
            {t.orderNumber(toPersianDigits(order.orderNumber))}
          </h2>
          <StatusBadge status={order.status} />
        </div>
        <div className="text-fg-muted text-sm">
          {t.placedAt}: {formatOrderDateTime(order.createdAt)}
        </div>
      </div>

      {order.status === "pending_payment" && (
        <div className="rounded-card bg-surface flex flex-col gap-3 p-5">
          {payNotice && (
            <p role="status" className="text-warn text-sm">
              {t.payFailedNotice}
            </p>
          )}
          {order.expiresAt && (
            <p className="text-warn text-sm">{t.payWindow(formatOrderDateTime(order.expiresAt))}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={!order.canPay || !onPay || paying} onClick={onPay}>
              {paying ? t.payRedirecting : t.payNow}
            </Button>
            {!order.canPay && <span className="text-fg-muted text-xs">{t.cannotPay}</span>}
          </div>
          {payError && (
            <p role="alert" className="text-danger text-sm">
              {payError}
            </p>
          )}
        </div>
      )}

      <Section title={t.itemsTitle}>
        <ul className="divide-line flex flex-col divide-y">
          {order.lines.map((l) => (
            <li key={l.variantId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Thumb src={l.imageUrl} alt={l.name} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  href={`/products/${l.slug}`}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {l.name}
                </Link>
                {l.variantLabel && <span className="text-fg-muted text-xs">{l.variantLabel}</span>}
                <span className="text-fg-muted text-xs">
                  {t.quantity(toPersianDigits(l.quantity))}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm">
                {l.originalUnitPrice > l.unitPrice && (
                  <del className="text-fg-muted text-xs">{price(l.originalUnitPrice)}</del>
                )}
                <span className="font-medium">{price(l.lineTotal)}</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title={t.summaryTitle}>
          <dl className="flex flex-col gap-2 text-sm">
            <Row label={t.subtotal} value={price(totals.subtotal)} />
            {totals.productDiscountTotal > 0 && (
              <Row
                label={t.productDiscount}
                value={price(totals.productDiscountTotal)}
                tone="text-ok"
              />
            )}
            {totals.couponDiscount > 0 && (
              <Row
                label={order.couponCode ? t.couponCode(order.couponCode) : t.couponDiscount}
                value={price(totals.couponDiscount)}
                tone="text-ok"
              />
            )}
            <Row
              label={t.shippingFee}
              value={totals.shippingFee > 0 ? price(totals.shippingFee) : t.shippingFree}
            />
            <div className="border-line flex justify-between border-t pt-3 text-base font-medium">
              <dt>{t.payable}</dt>
              <dd>{price(totals.total)}</dd>
            </div>
            {order.paidAt && <Row label={t.paidAt} value={formatOrderDate(order.paidAt)} />}
          </dl>
        </Section>

        <Section title={t.addressTitle}>
          <div className="text-sm leading-7">
            <p className="font-medium">
              {order.address.province}، {order.address.city}
            </p>
            <p className="text-fg-secondary">{order.address.street}</p>
            <p className="text-fg-muted">
              {t.postalLine(toPersianDigits(order.address.postalCode))}
            </p>
          </div>
          <div className="border-line border-t pt-3 text-sm">
            <p className="text-fg-muted">{t.recipientTitle}</p>
            <p className="mt-1">{order.recipient.name}</p>
            {order.recipient.phone && (
              <p dir="ltr" className="text-fg-secondary text-end">
                {toPersianDigits(order.recipient.phone)}
              </p>
            )}
          </div>
        </Section>
      </div>

      {(order.carrier || order.trackingCode) && (
        <Section title={t.shipmentTitle}>
          <dl className="flex flex-col gap-2 text-sm">
            {order.carrier && <Row label={t.carrier} value={order.carrier} />}
            {order.trackingCode && (
              <Row label={t.trackingCode} value={toPersianDigits(order.trackingCode)} />
            )}
          </dl>
        </Section>
      )}

      <Section title={t.timelineTitle}>
        <ol className="flex flex-col gap-3 text-sm">
          {order.timeline.map((e, i) => (
            <li key={`${e.status}-${e.at}-${i}`} className="flex flex-col gap-0.5">
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium">{statusLabel(e.status)}</span>
                <span className="text-fg-muted text-xs">{formatOrderDateTime(e.at)}</span>
              </span>
              {e.note && <span className="text-fg-secondary text-xs">{e.note}</span>}
            </li>
          ))}
        </ol>
      </Section>

      {actionError && (
        <p role="alert" className="text-danger text-sm">
          {actionError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          {t.refresh}
        </Button>
        {canCancel(order.status) &&
          (confirmingCancel ? (
            <span className="flex flex-wrap items-center gap-2 text-sm">
              <span>{t.cancelConfirm}</span>
              <Button variant="outline" size="sm" onClick={onConfirmCancel} disabled={cancelling}>
                {cancelling ? t.cancelling : t.cancelYes}
              </Button>
              <Button variant="ghost" size="sm" onClick={onAbortCancel} disabled={cancelling}>
                {t.cancelNo}
              </Button>
            </span>
          ) : (
            <Button variant="outline" size="sm" onClick={onAskCancel}>
              {t.cancel}
            </Button>
          ))}
      </div>
    </div>
  );
}
