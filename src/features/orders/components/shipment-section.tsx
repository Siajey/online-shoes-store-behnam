import { ordersCopy as t } from "../copy";
import { formatOrderDateTime } from "../format";
import { safeTrackingUrl, trackingStatusLabel } from "../tracking";
import type { OrderDetail } from "../types";
import { CopyCodeButton } from "./copy-code-button";

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-2">
    <dt className="text-fg-muted">{label}</dt>
    <dd className="flex items-center gap-2">{children}</dd>
  </div>
);

/** روش ارسال و رهگیری مرسوله؛ اگر هیچ‌کدام نباشد چیزی نشان نمی‌دهد. */
export function ShipmentSection({ order }: { order: OrderDetail }) {
  const { shippingMethod, tracking } = order;
  if (!shippingMethod && !tracking) return null;
  const url = safeTrackingUrl(tracking?.trackingUrl ?? null);
  return (
    <section className="rounded-card bg-surface flex flex-col gap-3 p-5">
      <h2 className="text-base font-medium">{t.shipmentTitle}</h2>
      <dl className="flex flex-col gap-2 text-sm">
        {shippingMethod && <Row label={t.shippingMethodLabel}>{shippingMethod.name}</Row>}
        {tracking?.carrier && <Row label={t.carrier}>{tracking.carrier}</Row>}
        {tracking?.status && (
          <Row label={t.trackingStatus}>{trackingStatusLabel(tracking.status)}</Row>
        )}
        {tracking?.trackingCode && (
          <Row label={t.trackingCode}>
            <span dir="ltr">{tracking.trackingCode}</span>
            <CopyCodeButton value={tracking.trackingCode} />
          </Row>
        )}
        {tracking?.deliveredAt && (
          <Row label={t.deliveredAtLabel}>{formatOrderDateTime(tracking.deliveredAt)}</Row>
        )}
      </dl>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-brand self-start text-sm underline underline-offset-4"
        >
          {t.trackLink}
        </a>
      )}
      {tracking && !tracking.autoTracked && tracking.trackingCode && (
        <p className="text-fg-muted text-xs">{t.trackingManualHint}</p>
      )}
      {tracking && tracking.events.length > 0 && (
        <div className="border-line border-t pt-3">
          <h3 className="text-fg-muted mb-2 text-sm">{t.trackingEventsTitle}</h3>
          <ol className="flex flex-col gap-3 text-sm">
            {tracking.events.map((e, i) => (
              <li key={`${e.status}-${e.at}-${i}`} className="flex flex-col gap-0.5">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium">{trackingStatusLabel(e.status)}</span>
                  <span className="text-fg-muted text-xs">{formatOrderDateTime(e.at)}</span>
                </span>
                {(e.description || e.location) && (
                  <span className="text-fg-secondary text-xs">
                    {[e.description, e.location].filter(Boolean).join(" · ")}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
