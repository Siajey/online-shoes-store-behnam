import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  disabled?: boolean;
  /** متن‌ها از بیرون می‌آیند تا این کامپوننت متن فارسی ثابت نداشته باشد. */
  labels: { group: string; increase: string; decrease: string };
  className?: string;
};

const step =
  "flex size-11 items-center justify-center rounded-full text-xl text-fg transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none";

/** انتخاب تعداد با دکمه‌های + و −. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  labels,
  className,
}: Props) {
  return (
    <div
      role="group"
      aria-label={labels.group}
      className={cn("bg-surface-2 flex h-13 items-center rounded-full px-1", className)}
    >
      <button
        type="button"
        aria-label={labels.increase}
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={step}
      >
        +
      </button>
      <span aria-live="polite" className="w-8 text-center font-medium">
        {toPersianDigits(value)}
      </span>
      <button
        type="button"
        aria-label={labels.decrease}
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={step}
      >
        −
      </button>
    </div>
  );
}
