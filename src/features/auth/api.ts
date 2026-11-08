import { api } from "@/lib/api";
import type { UserDto, VerifyOtpDto } from "./dto";
import { toUser } from "./mappers";
import type { User } from "./types";

/*
 * مسیرها از کد بک‌اند (auth.controller) تأیید شده‌اند. ورود و تأیید کد CSRF نمی‌خواهند.
 * ثبت‌نام جدا نیست: اگر شماره تازه باشد، «ورود با کد» خودش حساب می‌سازد.
 * ☐ در حالت توسعه کد همیشه ۱۲۳۴۵ است و پیامک واقعی فرستاده نمی‌شود.
 */

/** درخواست کد تأیید برای شماره‌ی استاندارد ۰۹xxxxxxxxx */
export async function requestOtp(phoneNumber: string, signal?: AbortSignal): Promise<void> {
  await api.post("/auth/login", {
    body: { loginMethod: "otp", credentials: { phoneNumber } },
    skipAuthRefresh: true,
    skipCsrf: true,
    signal,
  });
}

/** ارسال دوباره‌ی کد (محدودیت بک‌اند در محیط واقعی: هر ۲ دقیقه یک بار) */
export async function resendOtp(phoneNumber: string, signal?: AbortSignal): Promise<void> {
  await api.get(`/auth/send-login-otp/${encodeURIComponent(phoneNumber)}`, {
    skipAuthRefresh: true,
    skipCsrf: true,
    signal,
  });
}

/** تأیید کد: کوکی‌های ورود را سرور می‌نشاند و توکن CSRF تازه را برمی‌گرداند. */
export async function verifyOtp(
  phoneNumber: string,
  otp: string,
  signal?: AbortSignal,
): Promise<void> {
  const res = await api.post<VerifyOtpDto>("/auth/verify-login-otp", {
    body: { phoneNumber, otp },
    skipAuthRefresh: true,
    skipCsrf: true,
    signal,
  });
  // بعد از ورود، csrf_secret جدید نشسته؛ توکن قبلی دیگر معتبر نیست.
  api.setCsrfToken(res.data?.csrfToken ?? null);
}

export async function fetchMe(signal?: AbortSignal): Promise<User> {
  const res = await api.get<UserDto>("/users/me", { signal });
  return toUser(res.data);
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  api.setCsrfToken(null);
}

/** حذف حساب (DELETE /users/me، نیاز به CSRF). بعد از موفقیت نشست دیگر معتبر نیست. */
export async function deleteAccount(): Promise<void> {
  await api.delete("/users/me");
  api.setCsrfToken(null);
}

/** ذخیره‌ی نام و نام خانوادگی (پروفایل اگر نبود ساخته می‌شود). نیاز به CSRF دارد. */
export async function updateProfile(input: { firstName: string; lastName: string }): Promise<void> {
  await api.patch("/users/me", { body: input });
}
