import type { Category } from "./types";

export type CategoryTrail = {
  /** دسته‌ی اصلی که انتخاب (یا زیردسته‌ی انتخاب‌شده) به آن تعلق دارد */
  parent?: Category;
  /** دسته‌ی انتخاب‌شده‌ی فعلی */
  active?: Category;
};

/** دسته‌ی انتخاب‌شده (با slug) و دسته‌ی اصلی آن را پیدا می‌کند. */
export function findCategoryTrail(categories: Category[], slug?: string): CategoryTrail {
  if (!slug) return {};
  for (const top of categories) {
    if (top.slug === slug) return { parent: top, active: top };
    const child = top.children.find((c) => c.slug === slug);
    if (child) return { parent: top, active: child };
  }
  return {};
}
