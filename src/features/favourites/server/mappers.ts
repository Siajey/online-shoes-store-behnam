import type { Product } from "@/features/products/types";
import { mediaUrl } from "@/lib/media";
import { rialToToman } from "@/lib/money";
import type { FavoriteItemDto } from "./dto";

/** یک علاقه‌مندی سرور به مدل محصول فرانت. قیمت می‌تواند null باشد؛ آن‌وقت ناموجود حساب می‌شود. */
export function toFavouriteProduct(dto: FavoriteItemDto): Product {
  const min = rialToToman(dto.minPrice ?? 0);
  const max = dto.maxPrice === null ? null : rialToToman(dto.maxPrice);
  return {
    id: dto.productId,
    slug: dto.slug,
    name: dto.name,
    price: min,
    maxPrice: max !== null && max > min ? max : undefined,
    imageUrl: dto.imageUrl || mediaUrl(dto.imageKey),
    available: dto.inStock && dto.minPrice !== null,
  };
}
