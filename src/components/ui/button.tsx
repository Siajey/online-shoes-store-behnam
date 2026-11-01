import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap " +
  "transition-[background-color,opacity,transform] duration-150 active:scale-[0.98] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand hover:opacity-90",
  secondary: "bg-surface-2 text-fg hover:opacity-90",
  outline: "border border-line bg-transparent text-fg hover:bg-surface-2",
  ghost: "bg-transparent text-fg-secondary hover:bg-surface-2",
  danger: "bg-danger text-fg hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-13 px-7 text-base",
};

type VariantOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

/** کلاس‌های دکمه را می‌سازد؛ برای لینکی که شکل دکمه دارد هم قابل استفاده است. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: VariantOptions = {}): string {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export type ButtonProps = ComponentProps<"button"> &
  Omit<VariantOptions, "className"> & {
    /** در حالت بارگذاری، دکمه غیرفعال می‌شود و چرخان نمایش می‌دهد. */
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  className,
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonVariants({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 animate-spin motion-reduce:animate-none"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
