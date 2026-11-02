import type { CategoryDto } from "./dto";
import type { Category } from "./types";

export function toCategory(dto: CategoryDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    imageUrl: dto.image || undefined,
    children: (dto.children ?? []).map(toCategory),
  };
}
