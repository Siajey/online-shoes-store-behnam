import type { ProductDto } from "./dto";
import type { Product } from "./types";

/** تنها جایی که شکل API به مدل فرانت تبدیل می‌شود. */
export function toProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    tag: dto.badge ?? undefined,
    imageUrl: dto.imageUrl ?? undefined,
  };
}
