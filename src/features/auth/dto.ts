/** شکل واقعی data در GET /users/me (نمونه‌ی بک‌اند، ۱۴۰۵/۰۸/۱۴). */
export type UserDto = {
  id: string;
  phoneNumber: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  /** null تا وقتی نام یا آدرسی ثبت نشده. addresses هم همراهش می‌آید ولی از مسیر جدا خوانده می‌شود. */
  profile: ProfileDto | null;
};

export type ProfileDto = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
};

/** data در پاسخ POST /auth/verify-login-otp */
export type VerifyOtpDto = { csrfToken?: string };
