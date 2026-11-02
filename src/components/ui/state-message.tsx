import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** خطا برای صفحه‌خوان فوری اعلام می‌شود، «خالی» نه. */
  tone?: "empty" | "error";
  children: ReactNode;
  className?: string;
};

/** پیام ساده برای حالت‌های «خالی» و «خطا» در بخش‌هایی که داده می‌گیرند. */
export function StateMessage({ tone = "empty", children, className }: Props) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-card bg-surface px-6 py-10 text-center text-sm leading-8",
        tone === "error" ? "text-danger" : "text-fg-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}
