"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import { authStore } from "../auth-store";
import { authCopy } from "../copy";
import { useRequireAuth } from "../use-require-auth";
import { AccountError, AccountSkeleton, AccountView } from "./account-views";
import { AccountMenu } from "./account-menu";

/** خلاصه‌ی حساب: خوش‌آمد، منوی بخش‌ها، شماره و خروج. مهمان به /login می‌رود. */
export function AccountContent() {
  const router = useRouter();
  const auth = useRequireAuth("/account");
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | undefined>();

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
      <div className="flex flex-col gap-6">
        <AccountMenu
          name={[auth.user.firstName, auth.user.lastName].filter(Boolean).join(" ") || undefined}
        />
        <AccountView
          user={auth.user}
          onLogout={logout}
          loggingOut={loggingOut}
          error={logoutError}
        />
      </div>
    );
  }
  if (auth.status === "error") {
    return <AccountError message={auth.error} onRetry={() => void authStore.refresh()} />;
  }
  return <AccountSkeleton />;
}
