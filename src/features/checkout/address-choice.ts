import type { Address } from "@/features/addresses/types";

/**
 * آدرس انتخاب‌شده: اگر انتخاب فعلی هنوز در فهرست هست همان؛
 * وگرنه آدرس پیش‌فرض؛ وگرنه اولین آدرس؛ وگرنه هیچ.
 */
export function resolveSelectedAddressId(
  addresses: readonly Address[],
  current: string | null,
): string | null {
  if (current && addresses.some((a) => a.id === current)) return current;
  return (addresses.find((a) => a.isDefault) ?? addresses[0])?.id ?? null;
}
