export type RawSearchParams = Record<string, string | string[] | undefined>;

export type ProductFilters = {
  /** slug دسته‌بندی */
  category?: string;
  /** عبارت جستجو */
  q?: string;
};

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** پارامترهای آدرس را پاک‌سازی می‌کند؛ هر مقدار نامعتبر نادیده گرفته می‌شود. */
export function parseProductFilters(raw: RawSearchParams): ProductFilters {
  const category = first(raw.category)?.trim();
  const q = first(raw.q)?.trim().slice(0, 100);
  return {
    category: category && /^[a-z0-9-]{1,80}$/i.test(category) ? category : undefined,
    q: q || undefined,
  };
}
