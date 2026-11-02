import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type InputProps = Omit<ComponentProps<"input">, "size"> & {
  /** برچسب فیلد؛ همیشه لازم است (برای دسترس‌پذیری). */
  label: string;
  /** راهنمای کوتاه زیر فیلد. */
  hint?: string;
  /** پیام خطا؛ اگر باشد فیلد قرمز می‌شود و hint نمایش داده نمی‌شود. */
  error?: string;
  /** برای شماره موبایل، کد و ایمیل: متن چپ‌به‌راست ولی چسبیده به لبه‌ی راست. */
  ltr?: boolean;
};

export function Input({
  label,
  hint,
  error,
  ltr = false,
  className,
  id,
  disabled,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-fg-secondary text-sm">
        {label}
      </label>
      <input
        id={inputId}
        disabled={disabled}
        dir={ltr ? "ltr" : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          "bg-surface-2 text-fg h-13 w-full rounded-full border px-5 text-base",
          "placeholder:text-fg-muted",
          "transition-colors duration-150 motion-reduce:transition-none",
          "focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger" : "border-line",
          ltr && "text-end",
          className,
        )}
        {...props}
      />
      {message && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn("px-2 text-sm", error ? "text-danger" : "text-fg-muted")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
