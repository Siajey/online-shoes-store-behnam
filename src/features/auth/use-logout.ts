"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import { authStore } from "./auth-store";
import { authCopy } from "./copy";

/** خروج از حساب با وضعیت «در حال خروج» و پیام خطا (مثلاً قطعی اینترنت). */
export function useLogout() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function logout() {
    setLoggingOut(true);
    setError(undefined);
    try {
      await authStore.logout();
      router.replace("/");
    } catch (e) {
      setError(isApiRequestError(e) ? e.message : authCopy.unknownError);
      setLoggingOut(false);
    }
  }
  return { logout, loggingOut, error };
}
