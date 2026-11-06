/** مدل داخلی کاربر وارد‌شده. UI فقط با همین کار می‌کند. */
export type User = {
  id: string;
  /** شماره‌ی استاندارد ۰۹xxxxxxxxx */
  phoneNumber: string;
  role: string;
  status: string;
  hasProfile: boolean;
  /** از پروفایل؛ تا پر نشود undefined است (حداکثر ۲۰ حرف طبق بک‌اند). */
  firstName?: string;
  lastName?: string;
};
