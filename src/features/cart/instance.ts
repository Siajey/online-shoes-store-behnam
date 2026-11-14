import { authStore } from "@/features/auth/auth-store";
import { cartServerApi } from "./server/api";
import { createCartService } from "./service";
import { createCartStore } from "./store";

const local = createCartStore({
  getStorage: () => (typeof window === "undefined" ? null : window.localStorage),
  target: typeof window === "undefined" ? null : window,
});

/** نمونه‌ی اصلی برنامه: همه‌ی بخش‌های سایت سبد را فقط از اینجا می‌گیرند. */
export const cartStore = createCartService({ local, server: cartServerApi, auth: authStore });
