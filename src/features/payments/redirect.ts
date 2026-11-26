/** فقط آدرس https درگاه پذیرفته می‌شود؛ هر چیز دیگر (javascript:، http:، نامعتبر) رد می‌شود. */
export function safeGatewayUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export class PaymentRedirectError extends Error {
  constructor() {
    super("unsafe_gateway_redirect");
    this.name = "PaymentRedirectError";
  }
}
