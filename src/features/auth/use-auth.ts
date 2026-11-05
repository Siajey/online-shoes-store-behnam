"use client";

import { useEffect, useSyncExternalStore } from "react";
import { authStore } from "./auth-store";
import type { AuthState } from "./store";

/** وضعیت ورود. بار اول از سرور می‌پرسد؛ تا آن موقع status برابر unknown است. */
export function useAuth(): AuthState {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );
  useEffect(() => {
    void authStore.load();
  }, []);
  return state;
}
