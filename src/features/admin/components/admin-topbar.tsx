"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/use-auth";
import { adminTitle } from "../titles";
import { AdminTopbarView } from "./admin-topbar-view";

/** نوار بالای پنل با عنوان صفحه‌ی جاری و مدیر واردشده. */
export function AdminTopbar() {
  const auth = useAuth();
  return (
    <AdminTopbarView
      title={adminTitle(usePathname())}
      phone={auth.status === "authenticated" ? auth.user.phoneNumber : undefined}
    />
  );
}
