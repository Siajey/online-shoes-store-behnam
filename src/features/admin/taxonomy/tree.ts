import type { AdminCategory } from "./types";

export type CategoryRow = { category: AdminCategory; depth: number };

const byOrder = (a: AdminCategory, b: AdminCategory) =>
  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "fa");

/** فهرست تخت را به ردیف‌های درختی (والد، سپس فرزندها) با عمق تبدیل می‌کند. */
export function toCategoryRows(list: readonly AdminCategory[]): CategoryRow[] {
  const ids = new Set(list.map((c) => c.id));
  const children = new Map<string | null, AdminCategory[]>();
  for (const c of list) {
    // والدِ ناموجود یعنی ریشه، تا هیچ دسته‌ای گم نشود.
    const key = c.parentId && ids.has(c.parentId) ? c.parentId : null;
    children.set(key, [...(children.get(key) ?? []), c]);
  }
  const rows: CategoryRow[] = [];
  const seen = new Set<string>();
  const walk = (parent: string | null, depth: number) => {
    for (const c of (children.get(parent) ?? []).sort(byOrder)) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      rows.push({ category: c, depth });
      walk(c.id, depth + 1);
    }
  };
  walk(null, 0);
  return rows;
}

/** خود دسته و همهٔ زیردسته‌هایش؛ برای حذف از گزینه‌های «دستهٔ والد» (جلوگیری از حلقه). */
export function selfAndDescendantIds(list: readonly AdminCategory[], id: string): Set<string> {
  const result = new Set<string>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of list) {
      if (c.parentId && result.has(c.parentId) && !result.has(c.id)) {
        result.add(c.id);
        grew = true;
      }
    }
  }
  return result;
}
