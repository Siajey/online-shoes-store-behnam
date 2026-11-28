import { api } from "@/lib/api";
import type { ShippingOptionsDto } from "./dto";
import { toShippingOption } from "./mappers";
import type { ShippingOption } from "./types";

/**
 * روش‌های ارسال و هزینه‌ی هرکدام برای آدرس انتخاب‌شده و سبد فعلی سرور.
 * فقط با سشن (بدون CSRF).
 */
export async function fetchShippingOptions(addressId: string): Promise<ShippingOption[]> {
  const { data } = await api.get<ShippingOptionsDto>(
    `/shipping/options?addressId=${encodeURIComponent(addressId)}`,
  );
  return data.options.map(toShippingOption);
}
