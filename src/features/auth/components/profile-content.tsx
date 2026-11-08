"use client";

import { authStore } from "../auth-store";
import { useRequireAuth } from "../use-require-auth";
import { AccountError, AccountSkeleton } from "./account-views";
import { ProfileForm } from "./profile-form";

/** صفحه‌ی ویرایش پروفایل. مهمان به /login می‌رود. */
export function ProfileContent() {
  const auth = useRequireAuth("/account/profile");
  if (auth.status === "authenticated") return <ProfileForm user={auth.user} />;
  if (auth.status === "error") {
    return <AccountError message={auth.error} onRetry={() => void authStore.refresh()} />;
  }
  return <AccountSkeleton />;
}
