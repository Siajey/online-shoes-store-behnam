import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "brand" | "success" | "warning" | "danger";
export type BadgeSize = "sm" | "md";

const base = "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-surface-2 text-fg-secondary",
  brand: "bg-brand/15 text-brand",
  success: "bg-ok/15 text-ok",
  warning: "bg-warn/15 text-warn",
  danger: "bg-danger/15 text-danger",
};

const sizes: Record<BadgeSize, string> = {
  sm: "h-6 px-2.5 text-xs",
  md: "h-8 px-3 text-sm",
};

type VariantOptions = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
};

export function badgeVariants({
  variant = "neutral",
  size = "md",
  className,
}: VariantOptions = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}

export type BadgeProps = ComponentProps<"span"> &
  Omit<VariantOptions, "className"> & {
    /** نقطه‌ی رنگی کنار متن (مناسب وضعیت سفارش). */
    dot?: boolean;
  };

export function Badge({ variant, size, dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, size, className })} {...props}>
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
