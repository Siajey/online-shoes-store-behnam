/** مدل داخلی کاربر وارد‌شده. UI فقط با همین کار می‌کند. */
export type User = {
  id: string;
  /** شماره‌ی استاندارد ۰۹xxxxxxxxx */
  phoneNumber: string;
  role: string;
  status: string;
  /** ☐ شکل پروفایل (نام، ایمیل...) با همکار نهایی شود؛ فعلاً null است. */
  hasProfile: boolean;
};
