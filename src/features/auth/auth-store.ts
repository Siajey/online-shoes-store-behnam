import { onAuthLost } from "@/lib/api/auth-events";
import { fetchMe, logout } from "./api";
import { createAuthStore } from "./store";

/** نمونه‌ی اصلی برنامه. */
export const authStore = createAuthStore({ fetchMe: () => fetchMe(), logout });

// اگر هنگام درخواست‌های دیگر نشست از دست رفت، وضعیت به «مهمان» برگردد.
if (typeof window !== "undefined") onAuthLost(() => authStore.markGuest());
