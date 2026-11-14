import { attributeLabel } from "@/features/products/mappers";
import { mediaUrl } from "@/lib/media";
import { toPersianDigits } from "@/lib/format";
import { rialToToman } from "@/lib/money";
import type { CartItem } from "../types";
import type { CartDto, CartLineDto } from "./dto";
import type { ServerCart } from "./types";

/** نام جایگزین برای کالایی که دیگر در فروشگاه نیست. */
export const REMOVED_PRODUCT_NAME = "کالای حذف‌شده";

const variantText = (attributes: CartLineDto["attributes"]) =>
  attributes.map((a) => `${attributeLabel(a.name)} ${toPersianDigits(a.value)}`).join("، ") ||
  undefined;

/** یک ردیف سبد سرور به مدل داخلی. id همان قالب «محصول:ترکیب» ردیف‌های محلی است. */
export function toCartItem(line: CartLineDto): CartItem {
  const { product } = line;
  const price = rialToToman(line.unitPrice ?? 0);
  const original = line.originalUnitPrice === null ? 0 : rialToToman(line.originalUnitPrice);
  return {
    id: `${product?.id ?? "removed"}:${line.variantId}`,
    slug: product?.slug ?? "",
    name: product?.name ?? REMOVED_PRODUCT_NAME,
    price,
    originalPrice: original > price ? original : undefined,
    imageUrl: mediaUrl(product?.imageKey),
    quantity: line.quantity,
    productId: product?.id,
    variantId: line.variantId,
    variantLabel: variantText(line.attributes),
    maxQuantity: line.maxQuantity,
    unavailable: line.unavailableReason ?? undefined,
  };
}

export function toServerCart(dto: CartDto): ServerCart {
  return { items: dto.items.map(toCartItem), hasUnavailable: dto.hasUnavailableLines };
}
