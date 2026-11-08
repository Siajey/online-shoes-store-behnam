import { z } from "zod";
import { safeUrl } from "@/lib/safe-url";
import type { CartItem, CartVariant, CartableProduct } from "./types";

/** ☐ سقف تعداد را بعد از مشخص شدن موجودی انبار از API بگیرید. */
export const MAX_QUANTITY = 10;

const clampQuantity = (q: number) => Math.min(MAX_QUANTITY, Math.max(0, Math.floor(q)));

const itemSchema = z.object({
  id: z.string().min(1).max(100),
  slug: z.string().min(1).max(200),
  name: z.string().min(1).max(300),
  price: z.number().int().nonnegative(),
  originalPrice: z.number().int().positive().optional(),
  imageUrl: safeUrl.optional(),
  productId: z.string().min(1).max(100).optional(),
  variantId: z.string().min(1).max(100).optional(),
  variantLabel: z.string().min(1).max(200).optional(),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

export function toCartItem(
  product: CartableProduct,
  variant?: CartVariant,
): Omit<CartItem, "quantity"> {
  const { id, slug, name, price, originalPrice, imageUrl } = product;
  if (!variant) return { id, slug, name, price, originalPrice, imageUrl };
  return {
    id: `${id}:${variant.id}`,
    productId: id,
    variantId: variant.id,
    variantLabel: variant.label,
    slug,
    name,
    price: variant.price,
    originalPrice: variant.originalPrice,
    imageUrl,
  };
}

/** کالا را اضافه می‌کند؛ اگر از قبل هست، تعداد را زیاد می‌کند (حداکثر MAX_QUANTITY) و قیمت را تازه می‌کند. */
export function addItem(
  items: readonly CartItem[],
  item: Omit<CartItem, "quantity">,
  quantity = 1,
): readonly CartItem[] {
  const add = clampQuantity(quantity);
  if (add < 1) return items;
  const found = items.find((i) => i.id === item.id);
  if (!found) return [...items, { ...item, quantity: add }];
  const next = Math.min(MAX_QUANTITY, found.quantity + add);
  if (next === found.quantity) return items;
  return items.map((i) => (i.id === item.id ? { ...item, quantity: next } : i));
}

/** تعداد را مستقیم تعیین می‌کند؛ صفر یا کمتر یعنی حذف. */
export function setQuantity(
  items: readonly CartItem[],
  id: string,
  quantity: number,
): readonly CartItem[] {
  const q = clampQuantity(quantity);
  if (q < 1) return removeItem(items, id);
  const found = items.find((i) => i.id === id);
  if (!found || found.quantity === q) return items;
  return items.map((i) => (i.id === id ? { ...i, quantity: q } : i));
}

export function removeItem(items: readonly CartItem[], id: string): readonly CartItem[] {
  return items.some((i) => i.id === id) ? items.filter((i) => i.id !== id) : items;
}

/** مجموع تعداد کالاها (نه تعداد ردیف‌ها). */
export const cartCount = (items: readonly CartItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0);

export const cartTotal = (items: readonly CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);

/** مجموع سود تخفیف‌ها. */
export const cartSavings = (items: readonly CartItem[]) =>
  items.reduce(
    (sum, i) =>
      i.originalPrice && i.originalPrice > i.price
        ? sum + (i.originalPrice - i.price) * i.quantity
        : sum,
    0,
  );

export const lineTotal = (item: CartItem) => item.price * item.quantity;

const STORAGE_VERSION = 1;

export const serializeCart = (items: readonly CartItem[]) =>
  JSON.stringify({ v: STORAGE_VERSION, items });

/**
 * متن ذخیره‌شده را امن می‌خواند: خراب بودن یا دستکاری شدن، هرگز خطا نمی‌دهد.
 * ردیف‌های نامعتبر و تکراری کنار گذاشته می‌شوند.
 */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return [];
    const { v, items } = data as { v?: unknown; items?: unknown };
    if (v !== STORAGE_VERSION || !Array.isArray(items)) return [];
    const seen = new Set<string>();
    const result: CartItem[] = [];
    for (const entry of items) {
      const parsed = itemSchema.safeParse(entry);
      if (parsed.success && !seen.has(parsed.data.id)) {
        seen.add(parsed.data.id);
        result.push(parsed.data);
      }
    }
    return result;
  } catch {
    return [];
  }
}
