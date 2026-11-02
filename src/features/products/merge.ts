import type { Product } from "./types";

/** محصولات صفحه‌ی بعد را اضافه می‌کند و تکراری‌ها را (بر اساس id) نمی‌گذارد. */
export function mergeProducts(existing: Product[], incoming: Product[]): Product[] {
  const seen = new Set(existing.map((p) => p.id));
  return [...existing, ...incoming.filter((p) => !seen.has(p.id))];
}
