import type { ShippingOption } from "./types";

/**
 * کد روش ارسال انتخاب‌شده: انتخاب کاربر اگر هنوز در دسترس است، وگرنه اولین روش در دسترس.
 * اگر هیچ روشی در دسترس نباشد null.
 */
export function resolveShippingCode(
  options: readonly ShippingOption[],
  chosen: string | null,
): string | null {
  const usable = options.filter((o) => o.available);
  if (chosen && usable.some((o) => o.code === chosen)) return chosen;
  return usable[0]?.code ?? null;
}
