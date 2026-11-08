import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string };

export type SelectProps = Omit<ComponentProps<"select">, "size"> & {
  label: string;
  options: readonly SelectOption[];
  /** گزینه‌ی خالی اول (مثلاً «انتخاب استان») */
  placeholder?: string;
  hint?: string;
  error?: string;
};

/** انتخاب از فهرست؛ هم‌ظاهر Input و با select بومی (کیبورد و موبایل بدون هزینه). */
export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  className,
  id,
  disabled,
  ...props
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const messageId = `${selectId}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className="text-fg-secondary text-sm">
        {label}
      </label>
      <select
        id={selectId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          "bg-surface-2 text-fg h-13 w-full rounded-full border px-5 text-base",
          "focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger" : "border-line",
          className,
        )}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
