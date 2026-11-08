"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import { deleteAccount } from "../api";
import { authStore } from "../auth-store";
import { authCopy } from "../copy";
import { useRequireAuth } from "../use-require-auth";
import { AccountError, AccountSkeleton } from "./account-views";
import { SecurityView } from "./security-view";

/** صفحه‌ی امنیت حساب. مهمان به /login می‌رود. */
export function SecurityContent() {
  const router = useRouter();
  const auth = useRequireAuth("/account/security");
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const fail = (e: unknown) => setError(isApiRequestError(e) ? e.message : authCopy.unknownError);

  async function logout() {
    setError(undefined);
    setLoggingOut(true);
    try {
      await authStore.logout();
      router.replace("/");
    } catch (e) {
      fail(e);
      setLoggingOut(false);
    }
  }

  async function remove() {
    setError(undefined);
    setDeleting(true);
    try {
      await deleteAccount();
      authStore.markGuest();
      router.replace("/");
    } catch (e) {
      fail(e);
      setDeleting(false);
    }
  }

  if (auth.status === "error") {
    return <AccountError message={auth.error} onRetry={() => void authStore.refresh()} />;
  }
  if (auth.status !== "authenticated") return <AccountSkeleton />;
  return (
    <SecurityView
      onLogout={logout}
      loggingOut={loggingOut}
      confirmingDelete={confirming}
      onAskDelete={() => setConfirming(true)}
      onCancelDelete={() => setConfirming(false)}
      onConfirmDelete={remove}
      deleting={deleting}
      error={error}
    />
  );
}
