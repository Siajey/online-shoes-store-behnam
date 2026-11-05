import { isApiRequestError } from "@/lib/api/errors";
import { authCopy } from "./copy";
import type { User } from "./types";

export type AuthState =
  /** هنوز بررسی نشده (روی سرور و هنگام هیدریت) */
  | { status: "unknown"; user: null; error: null }
  | { status: "guest"; user: null; error: null }
  | { status: "authenticated"; user: User; error: null }
  /** بررسی ورود به‌خاطر قطعی یا خطای سرور ناموفق بود؛ مهمان فرض نمی‌شود. */
  | { status: "error"; user: null; error: string };

const UNKNOWN: AuthState = { status: "unknown", user: null, error: null };
const GUEST: AuthState = { status: "guest", user: null, error: null };

type Deps = {
  fetchMe: () => Promise<User>;
  logout: () => Promise<void>;
};

/** فروشگاه وضعیت ورود، سازگار با useSyncExternalStore. */
export function createAuthStore({ fetchMe, logout }: Deps) {
  let state: AuthState = UNKNOWN;
  let started = false;
  let inFlight: Promise<void> | null = null;
  const listeners = new Set<() => void>();

  const set = (next: AuthState) => {
    state = next;
    listeners.forEach((l) => l());
  };

  /** پاسخ ۴۰۱/۴۰۳ یعنی مهمان؛ هر خطای دیگر یعنی «نمی‌دانیم». */
  function refresh(): Promise<void> {
    started = true;
    inFlight ??= fetchMe()
      .then((user) => set({ status: "authenticated", user, error: null }))
      .catch((error: unknown) => {
        if (isApiRequestError(error) && (error.status === 401 || error.status === 403)) {
          set(GUEST);
        } else {
          set({
            status: "error",
            user: null,
            error: isApiRequestError(error) ? error.message : authCopy.unknownError,
          });
        }
      })
      .finally(() => {
        inFlight = null;
      });
    return inFlight;
  }

  return {
    getSnapshot: (): AuthState => state,
    getServerSnapshot: (): AuthState => UNKNOWN,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    /** فقط بار اول از سرور می‌پرسد. */
    load(): Promise<void> {
      return started ? (inFlight ?? Promise.resolve()) : refresh();
    },
    /** دوباره از سرور می‌پرسد (مثلاً بعد از ورود). */
    refresh,
    /** خروج: اگر درخواست خروج خطا بدهد، خطا پرتاب می‌شود و وضعیت ورود دست نمی‌خورد. */
    async logout(): Promise<void> {
      await logout();
      set(GUEST);
    },
    /** وقتی نشست از دست رفته (refresh هم شکست خورد). */
    markGuest() {
      set(GUEST);
    },
  };
}

export type AuthStore = ReturnType<typeof createAuthStore>;
