import { authStore } from "@/features/auth/auth-store";
import { favouritesServerApi } from "./server/api";
import { createFavouritesService } from "./service";
import { localFavourites } from "./store";

/** نمونه‌ی اصلی برنامه: همه‌ی بخش‌های سایت علاقه‌مندی‌ها را فقط از اینجا می‌گیرند. */
export const favouritesStore = createFavouritesService({
  local: localFavourites,
  server: favouritesServerApi,
  auth: authStore,
});
