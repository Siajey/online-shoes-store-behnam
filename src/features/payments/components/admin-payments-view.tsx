import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { formatOrderDateTime } from "@/features/orders/format";
import { TONE_CLASS } from "@/features/orders/status";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { paymentsCopy as t } from "../copy";
import type { AdminPayment, PaymentStatus } from "../types";

const TONE: Record<PaymentStatus, keyof typeof TONE_CLASS> = {
  initiated: "muted",
  redirected: "warn",
  paid: "ok",
  failed: "danger",
  expired: "muted",
};

export type AdminPaymentsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: AdminPayment[] };

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between gap-3">
    <dt className="text-fg-muted">{label}</dt>
    <dd className="min-w-0 text-end break-words">{value}</dd>
  </div>
);

function PaymentCard({ p }: { p: AdminPayment }) {
  const a = t.admin;
  return (
    <li className="bg-surface-2 flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`${TONE_CLASS[TONE[p.status]]} rounded-full px-3 py-1 text-xs font-medium`}
        >
          {t.status[p.status]}
        </span>
        <span className="text-sm font-medium">
          {formatPrice(p.amount, { unit: false })}{" "}
          <span className="text-fg-muted text-xs font-light">{siteConfig.currency.unit}</span>
        </span>
      </div>
      <dl className="flex flex-col gap-2 text-sm">
        <Row label={a.gateway} value={<span dir="ltr">{p.gateway}</span>} />
        {p.trackingCode && (
          <Row label={a.tracking} value={<span dir="ltr">{p.trackingCode}</span>} />
        )}
        {p.cardMask && <Row label={a.card} value={<span dir="ltr">{p.cardMask}</span>} />}
        {p.failureReason && (
          <Row label={a.failure} value={<span dir="ltr">{p.failureReason}</span>} />
        )}
        <Row label={a.createdAt} value={formatOrderDateTime(p.createdAt)} />
        {p.paidAt && <Row label={a.paidAt} value={formatOrderDateTime(p.paidAt)} />}
        {p.status === "paid" && (
          <Row
            label={a.confirmedAt}
            value={p.orderConfirmedAt ? formatOrderDateTime(p.orderConfirmedAt) : a.notConfirmed}
          />
        )}
      </dl>
    </li>
  );
}

export function AdminPaymentsView({
  state,
  onRetry,
}: {
  state: AdminPaymentsState;
  onRetry: () => void;
}) {
  const a = t.admin;
  return (
    <section aria-label={a.title} className="rounded-card bg-surface flex flex-col gap-3 p-5">
      <h2 className="text-base font-medium">{a.title}</h2>
      {state.status === "loading" && <StateMessage>{a.loading}</StateMessage>}
      {state.status === "error" && (
        <StateMessage tone="error">
          <p>{state.message}</p>
          <Button className="mt-3" variant="secondary" onClick={onRetry}>
            {a.retry}
          </Button>
        </StateMessage>
      )}
      {state.status === "ready" &&
        (state.items.length === 0 ? (
          <StateMessage>{a.empty}</StateMessage>
        ) : (
          <ul className="flex flex-col gap-3">
            {state.items.map((p) => (
              <PaymentCard key={p.id} p={p} />
            ))}
          </ul>
        ))}
    </section>
  );
}
