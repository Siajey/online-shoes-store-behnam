import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { paymentsCopy as t } from "../copy";
import type { ResultState } from "../result";

export type PaymentResultViewProps = {
  state: ResultState;
  /** برای لینک «مشاهده‌ی سفارش» و «پرداخت دوباره» */
  orderId: string | null;
  onRecheck: () => void;
  onPayAgain: () => void;
  paying: boolean;
  payError?: string;
};

const ICON_PATHS = {
  ok: "M5 13l4 4L19 7",
  bad: "M6 6l12 12M18 6L6 18",
  wait: "M12 7v5l3 2",
} as const;

function Icon({ tone }: { tone: keyof typeof ICON_PATHS }) {
  const color = tone === "ok" ? "text-ok" : tone === "bad" ? "text-danger" : "text-warn";
  return (
    <span className={`bg-surface-2 ${color} flex size-16 items-center justify-center rounded-full`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {tone === "wait" && <circle cx="12" cy="12" r="9" />}
        <path d={ICON_PATHS[tone]} />
      </svg>
    </span>
  );
}

function Card({
  tone,
  title,
  text,
  children,
  live = "polite",
}: {
  tone: keyof typeof ICON_PATHS;
  title: string;
  text?: string;
  children?: React.ReactNode;
  live?: "polite" | "assertive";
}) {
  return (
    <div
      role={live === "assertive" ? "alert" : "status"}
      className="rounded-card bg-surface flex flex-col items-center gap-4 p-8 text-center"
    >
      <Icon tone={tone} />
      <h1 className="text-xl font-extrabold">{title}</h1>
      {text && <p className="text-fg-secondary max-w-sm text-sm leading-8">{text}</p>}
      {children}
    </div>
  );
}

const orderHref = (id: string | null) => (id ? `/account/orders/${id}` : "/account/orders");

export function PaymentResultView({
  state,
  orderId,
  onRecheck,
  onPayAgain,
  paying,
  payError,
}: PaymentResultViewProps) {
  const r = t.result;
  const viewOrder = (
    <Link href={orderHref(orderId)} className={buttonVariants({ variant: "secondary" })}>
      {orderId ? r.viewOrder : r.myOrders}
    </Link>
  );

  switch (state.kind) {
    case "verifying":
    case "waiting":
      return (
        <div
          role="status"
          aria-busy="true"
          className="rounded-card bg-surface flex flex-col items-center gap-3 p-8 text-center"
        >
          <p className="font-medium">{r.verifying}</p>
          <p className="text-fg-muted text-sm">{r.waitingHint}</p>
        </div>
      );
    case "paid":
      return (
        <Card tone="ok" title={r.paid.title} text={r.paid.text}>
          <p className="text-sm">
            <span className="text-fg-muted">{r.amount}: </span>
            <span className="font-medium">
              {formatPrice(state.payment.amount, { unit: false })}
            </span>{" "}
            <span className="text-fg-muted text-xs">{siteConfig.currency.unit}</span>
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {viewOrder}
            <Link href="/products" className={buttonVariants()}>
              {r.continueShopping}
            </Link>
          </div>
        </Card>
      );
    case "failed":
      return (
        <Card tone="bad" title={r.failed.title} text={r.failed.text} live="assertive">
          {payError && <p className="text-danger text-sm">{payError}</p>}
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {orderId && (
              <Button onClick={onPayAgain} disabled={paying}>
                {paying ? r.redirecting : r.payAgain}
              </Button>
            )}
            {viewOrder}
          </div>
        </Card>
      );
    case "timeout":
      return (
        <Card tone="wait" title={r.timeout.title} text={r.timeout.text}>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button onClick={onRecheck}>{r.recheck}</Button>
            {viewOrder}
          </div>
        </Card>
      );
    case "invalid":
      return (
        <Card tone="bad" title={r.invalid.title} text={r.invalid.text} live="assertive">
          <Link href="/account/orders" className={buttonVariants({ className: "mt-2" })}>
            {r.myOrders}
          </Link>
        </Card>
      );
    case "error":
      return (
        <Card tone="bad" title={state.message} live="assertive">
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button onClick={onRecheck}>{r.retry}</Button>
            {viewOrder}
          </div>
        </Card>
      );
  }
}
