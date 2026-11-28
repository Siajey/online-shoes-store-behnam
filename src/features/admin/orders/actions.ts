import type { OrderStatus, OrderStatusAction } from "@/features/orders/types";

export type AdminOrderActionKind = OrderStatusAction["action"];

/** عملیات‌های مجاز برای هر وضعیت (طبق قرارداد بک‌اند؛ تصمیم نهایی با سرور است). */
const ACTIONS: Record<OrderStatus, readonly AdminOrderActionKind[]> = {
  pending_payment: [],
  paid: ["startProcessing", "cancel"],
  processing: ["ship", "cancel"],
  shipped: ["updateTracking", "deliver"],
  delivered: [],
  cancelled: [],
  expired: [],
};

export const adminActionsFor = (status: OrderStatus): readonly AdminOrderActionKind[] =>
  ACTIONS[status];

export type ActionDraft = { carrier: string; trackingCode: string; note: string };

export const EMPTY_DRAFT: ActionDraft = { carrier: "", trackingCode: "", note: "" };

const LIMITS = { trackingCode: 100, note: 500 } as const;

/** از فرم، بدنه‌ی درخواست می‌سازد؛ فیلد خالی فرستاده نمی‌شود. null یعنی فرم نامعتبر. */
export function buildAction(kind: AdminOrderActionKind, d: ActionDraft): OrderStatusAction | null {
  const note = d.note.trim();
  if (note.length > LIMITS.note) return null;
  const withNote = note ? { note } : {};
  if (kind === "updateTracking") {
    const code = d.trackingCode.trim();
    if (!code || code.length > LIMITS.trackingCode) return null;
    return { action: "updateTracking", trackingCode: code, ...withNote };
  }
  if (kind !== "ship") return { action: kind, ...withNote };
  // شرکت حمل از روی روش ارسال سفارش تعیین می‌شود؛ فقط کد رهگیری (اختیاری) فرستاده می‌شود.
  const trackingCode = d.trackingCode.trim();
  if (trackingCode.length > LIMITS.trackingCode) return null;
  return { action: "ship", ...(trackingCode ? { trackingCode } : {}), ...withNote };
}
