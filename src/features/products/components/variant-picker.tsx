import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { productCopy } from "../copy";
import type { OptionGroup, Selection } from "../variants";

type Props = {
  groups: readonly OptionGroup[];
  selection: Selection;
  onToggle: (name: string, value: string) => void;
};

/** انتخاب سایز و رنگ: هر گروه یک دسته دکمه‌ی رادیویی؛ مقدارهای ناموجود غیرفعال‌اند. */
export function VariantPicker({ groups, selection, onToggle }: Props) {
  return (
    <div className="flex flex-col gap-5" role="group" aria-label={productCopy.optionsLabel}>
      {groups.map((g) => (
        <fieldset key={g.name} className="flex flex-col gap-3">
          <legend className="text-fg-secondary mb-3 text-sm">
            {g.name}
            {selection[g.name] && (
              <span className="text-fg ms-2 font-medium">{toPersianDigits(selection[g.name])}</span>
            )}
          </legend>
          <div className="flex flex-wrap gap-2">
            {g.values.map((o) => {
              const selected = selection[g.name] === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={!o.available}
                  title={o.available ? undefined : productCopy.optionUnavailable}
                  onClick={() => onToggle(g.name, o.value)}
                  className={cn(
                    "focus-visible:outline-brand min-h-11 min-w-12 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
                    selected
                      ? "bg-brand text-on-brand border-brand"
                      : "bg-surface-2 text-fg border-line hover:border-brand",
                    !o.available &&
                      "text-fg-muted hover:border-line cursor-not-allowed line-through opacity-50",
                  )}
                >
                  {toPersianDigits(o.value)}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
