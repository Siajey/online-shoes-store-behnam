import { z } from "zod";
import { safeUrl } from "@/lib/safe-url";
import type { Product } from "@/features/products/types";

/** سقف تعداد علاقه‌مندی‌ها؛ برای جلوگیری از پر شدن بی‌دلیل حافظه‌ی مرورگر. */
export const MAX_FAVOURITES = 100;

const productSchema = z.object({
  id: z.string().min(1).max(100),
  slug: z.string().min(1).max(200),
  name: z.string().min(1).max(300),
  sku: z.string().max(100).optional(),
  price: z.number().int().nonnegative(),
  originalPrice: z.number().int().positive().optional(),
  discountLabel: z.string().max(100).optional(),
  tag: z.string().max(100).optional(),
  imageUrl: safeUrl.optional(),
  available: z.boolean(),
  categoryName: z.string().max(200).optional(),
  categorySlug: z.string().max(200).optional(),
});

export const isFavourite = (items: readonly Product[], id: string) =>
  items.some((p) => p.id === id);

/**
 * اگر در لیست است حذف می‌کند، وگرنه به ابتدای لیست اضافه می‌کند (تازه‌ترین بالاتر).
 * با رسیدن به سقف، قدیمی‌ترین کنار گذاشته می‌شود.
 */
export function toggleFavourite(items: readonly Product[], product: Product): readonly Product[] {
  if (isFavourite(items, product.id)) return items.filter((p) => p.id !== product.id);
  return [product, ...items].slice(0, MAX_FAVOURITES);
}

const STORAGE_VERSION = 1;

export const serializeFavourites = (items: readonly Product[]) =>
  JSON.stringify({ v: STORAGE_VERSION, items });

/** متن ذخیره‌شده را امن می‌خواند: خراب یا دستکاری‌شده، هرگز خطا نمی‌دهد. */
export function parseStoredFavourites(raw: string | null): Product[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return [];
    const { v, items } = data as { v?: unknown; items?: unknown };
    if (v !== STORAGE_VERSION || !Array.isArray(items)) return [];
    const seen = new Set<string>();
    const result: Product[] = [];
    for (const entry of items) {
      const parsed = productSchema.safeParse(entry);
      if (parsed.success && !seen.has(parsed.data.id) && result.length < MAX_FAVOURITES) {
        seen.add(parsed.data.id);
        result.push(parsed.data);
      }
    }
    return result;
  } catch {
    return [];
  }
}
