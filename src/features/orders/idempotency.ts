/** کلید یکتا برای ثبت سفارش (۸ تا ۱۰۰ نویسه). */
export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `order-${crypto.randomUUID()}`;
  }
  return `order-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
