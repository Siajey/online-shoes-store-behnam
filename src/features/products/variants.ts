import type { ProductVariant } from "./types";

/** انتخاب کاربر: نام گروه (مثل «سایز») به مقدار. */
export type Selection = Readonly<Record<string, string>>;

export type OptionValue = { value: string; available: boolean };
export type OptionGroup = { name: string; values: OptionValue[] };

function sortValues(values: string[]): string[] {
  const numeric = values.map((v) =>
    Number(v.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))),
  );
  return numeric.every((n) => Number.isFinite(n))
    ? values
        .map((v, i) => ({ v, n: numeric[i] }))
        .sort((a, b) => a.n - b.n)
        .map((x) => x.v)
    : values;
}

const matches = (v: ProductVariant, sel: Selection) =>
  Object.entries(sel).every(([name, value]) => v.options[name] === value);

/** گروه‌های انتخاب به ترتیب اولین دیدن؛ مقدار عددی (سایز) صعودی. available یعنی با انتخاب‌های فعلی ترکیب موجود دارد. */
export function optionGroups(
  variants: readonly ProductVariant[],
  selection: Selection,
): OptionGroup[] {
  const names: string[] = [];
  for (const v of variants)
    for (const n of Object.keys(v.options)) if (!names.includes(n)) names.push(n);

  return names.map((name) => {
    const raw: string[] = [];
    for (const v of variants) {
      const val = v.options[name];
      if (val !== undefined && !raw.includes(val)) raw.push(val);
    }
    const others = Object.fromEntries(Object.entries(selection).filter(([n]) => n !== name));
    return {
      name,
      values: sortValues(raw).map((value) => ({
        value,
        available: variants.some(
          (v) => v.available && v.options[name] === value && matches(v, others),
        ),
      })),
    };
  });
}

/** گروه‌هایی که هنوز انتخاب نشده‌اند. */
export function missingGroups(variants: readonly ProductVariant[], selection: Selection): string[] {
  return optionGroups(variants, {})
    .map((g) => g.name)
    .filter((n) => !selection[n]);
}

/** ترکیب کامل انتخاب‌شده؛ تا همه‌ی گروه‌ها انتخاب نشده undefined. */
export function findVariant(
  variants: readonly ProductVariant[],
  selection: Selection,
): ProductVariant | undefined {
  if (missingGroups(variants, selection).length > 0) return undefined;
  return variants.find((v) => matches(v, selection));
}

/** انتخاب/لغو یک مقدار؛ انتخاب‌های دیگری که با ترکیب جدید ناموجودند، برداشته می‌شوند. */
export function toggleSelection(
  variants: readonly ProductVariant[],
  selection: Selection,
  name: string,
  value: string,
): Selection {
  if (selection[name] === value) {
    const { [name]: _removed, ...rest } = selection;
    void _removed;
    return rest;
  }
  const next: Record<string, string> = { ...selection, [name]: value };
  for (const other of Object.keys(next)) {
    if (other === name) continue;
    const pair = { [name]: value, [other]: next[other] };
    if (!variants.some((v) => v.available && matches(v, pair))) delete next[other];
  }
  return next;
}

/** برچسب کوتاه برای سبد، مثل «سایز ۴۲، رنگ مشکی». */
export function variantLabel(variant: ProductVariant): string {
  return Object.entries(variant.options)
    .map(([n, v]) => `${n} ${v}`)
    .join("، ");
}
