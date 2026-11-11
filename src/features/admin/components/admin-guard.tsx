"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { authStore } from "@/features/auth/auth-store";
import { useAuth } from "@/features/auth/use-auth";
import { adminAccess } from "../guard";
import { AdminGateView } from "./admin-gate-view";

/** فقط مدیر وارد‌شده محتوا را می‌بیند؛ مهمان به ورود می‌رود. */
export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const auth = useAuth();
  const access = adminAccess(auth);
  useEffect(() => {
    if (access === "guest") router.replace("/login?next=%2Fadmin%2Fproducts");
  }, [access, router]);
  return (
    <AdminGateView access={access} onRetry={() => void authStore.refresh()}>
      {children}
    </AdminGateView>
  );
}
