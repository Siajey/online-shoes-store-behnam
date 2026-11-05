/** شکل واقعی data در GET /users/me (نمونه‌ی بک‌اند، ۱۴۰۵/۰۸/۱۴). */
export type UserDto = {
  id: string;
  phoneNumber: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile: unknown;
};

/** data در پاسخ POST /auth/verify-login-otp */
export type VerifyOtpDto = { csrfToken?: string };
