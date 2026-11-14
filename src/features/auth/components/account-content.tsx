"use client";

import { authStore } from "../auth-store";
import { useLogout } from "../use-logout";
import { useRequireAuth } from "../use-require-auth";
import { AccountError, AccountSkeleton } from "./account-views";
import { AccountMenu } from "./account-menu";

/** خلاصه‌ی حساب: خوش‌آمد، منوی بخش‌ها و خروج. مهمان به /login می‌رود. */
export function AccountContent() {
  const auth = useRequireAuth("/account");
  const { logout, loggingOut, error } = useLogout();

  if (auth.status === "authenticated") {
    return (
      <AccountMenu
        name={[auth.user.firstName, auth.user.lastName].filter(Boolean).join(" ") || undefined}
        phone={auth.user.phoneNumber}
        onLogout={logout}
        loggingOut={loggingOut}
        error={error}
      />
    );
  }
  if (auth.status === "error") {
    return <AccountError message={auth.error} onRetry={() => void authStore.refresh()} />;
  }
  return <AccountSkeleton />;
}
