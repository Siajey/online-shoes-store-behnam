/** شکل پاسخ بک‌اند (address.controller). فیلدهای دیگر مثل profileId و تاریخ‌ها استفاده نمی‌شوند. */
export type AddressDto = {
  id: string;
  province: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
};
