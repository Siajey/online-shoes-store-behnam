import type { Metadata } from "next";
import { AdminGuard } from "@/features/admin/components/admin-guard";
import { AdminShell } from "@/features/admin/components/admin-shell";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

/** چیدمان جدا از فروشگاه: بدون هدر و فوتر سایت. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
