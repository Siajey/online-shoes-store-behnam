import { ordersCopy } from "./copy";
import type { OrderStatus } from "./types";

export type StatusTone = "warn" | "ok" | "info" | "danger" | "muted";

export const STATUS_TONE: Record<OrderStatus, StatusTone> = {
  pending_payment: "warn",
  paid: "ok",
  processing: "info",
  shipped: "info",
  delivered: "ok",
  cancelled: "danger",
  expired: "muted",
};

export const statusLabel = (s: OrderStatus): string => ordersCopy.status[s];

export const TONE_CLASS: Record<StatusTone, string> = {
  warn: "bg-surface-2 text-warn",
  ok: "bg-surface-2 text-ok",
  info: "bg-surface-2 text-brand",
  danger: "bg-surface-2 text-danger",
  muted: "bg-surface-2 text-fg-muted",
};

/** فقط سفارش در انتظار پرداخت را مشتری می‌تواند لغو کند. */
export const canCancel = (s: OrderStatus): boolean => s === "pending_payment";
