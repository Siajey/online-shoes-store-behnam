import Image from "next/image";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { statusLabel, STATUS_TONE, TONE_CLASS } from "../status";
import type { OrderStatus } from "../types";

export const price = (amount: number) => (
  <>
    {formatPrice(amount, { unit: false })}{" "}
    <span className="text-fg-muted text-xs font-light">{siteConfig.currency.unit}</span>
  </>
);

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`${TONE_CLASS[STATUS_TONE[status]]} shrink-0 rounded-full px-3 py-1 text-xs font-medium`}
    >
      {statusLabel(status)}
    </span>
  );
}

export function Thumb({ src, alt }: { src?: string; alt: string }) {
  return (
    <span className="bg-surface-2 relative block size-16 shrink-0 overflow-hidden rounded-lg">
      {src && <Image src={src} alt={alt} fill sizes="64px" className="object-cover" />}
    </span>
  );
}
