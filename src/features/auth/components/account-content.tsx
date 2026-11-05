"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import { authStore } from "../auth-store";
import { authCopy } from "../copy";
import { useAuth } from "../use-auth";
import { AccountError, AccountSkeleton, AccountView } from "./account-views";

/** صفحه‌ی حساب: مهمان به /login می‌رود و بعد از ورود به همین‌جا برمی‌گردد. */
export function AccountContent() {
  const router = useRouter();
  const auth = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | undefined>();

  useEffect(() => {
    if (auth.status === "guest") router.replace(`/login?next=${encodeURIComponent("/account")}`);
  }, [auth.status, router]);

  async function logout() {
    setLoggingOut(true);
    setLogoutError(undefined);
    try {
      await authStore.logout();
      router.replace("/");
    } catch (e) {
      setLogoutError(isApiRequestError(e) ? e.message : authCopy.unknownError);
      setLoggingOut(false);
    }
  }

  if (auth.status === "authenticated") {
    return (
      <AccountView user={auth.user} onLogout={logout} loggingOut={loggingOut} error={logoutError} />
    );
  }
  if (auth.status === "error") {
    return <AccountError message={auth.error} onRetry={() => void authStore.refresh()} />;
  }
  // unknown یا guest (در حال هدایت): اسکلت
  return <AccountSkeleton />;
}
