"use client";

import type { AccountKey } from "../account-nav";
import { useAuth } from "../use-auth";
import { useLogout } from "../use-logout";
import { AccountSidebarView } from "./account-sidebar-view";

/** نوار کناری حساب؛ نام و شماره را از وضعیت ورود می‌گیرد. */
export function AccountSidebar({ current }: { current: AccountKey }) {
  const auth = useAuth();
  const { logout, loggingOut, error } = useLogout();
  const user = auth.status === "authenticated" ? auth.user : undefined;
  const name = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "";
  return (
    <AccountSidebarView
      current={current}
      name={name || undefined}
      phone={user?.phoneNumber}
      onLogout={logout}
      loggingOut={loggingOut}
      error={error}
    />
  );
}
