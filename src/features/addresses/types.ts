export type Address = {
  id: string;
  province: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
};

/** فیلدهایی که کاربر پر می‌کند (همه الزامی‌اند). */
export type AddressInput = Pick<Address, "province" | "city" | "street" | "postalCode">;

/** سقف تعداد آدرس‌ها در بک‌اند (خطای ۴۰۹ ADDRESS_LIMIT_REACHED). */
export const MAX_ADDRESSES = 2;
