import Image from "next/image";
import Link from "next/link";
import { ShoeIllustration } from "@/components/illustrations/shoe-illustration";
import { cn } from "@/lib/cn";
import { categoryHref } from "../routes";
import type { Category } from "../types";

const grid = "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className={grid}>
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={categoryHref(category.slug)}
            className="rounded-card bg-surface hover:bg-surface-2 focus-visible:outline-brand flex h-44 flex-col justify-between overflow-hidden p-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none lg:h-45"
          >
            <span className="text-lg font-medium lg:text-xl">{category.name}</span>
            {category.imageUrl ? (
              // alt خالی: نام دسته همان بالا نوشته شده است. unoptimized تا دامنه‌ی تصاویر نهایی شود.
              <Image
                src={category.imageUrl}
                alt=""
                width={150}
                height={75}
                unoptimized
                className="h-16 w-auto self-start rounded-xl object-cover"
              />
            ) : (
              <ShoeIllustration className="w-28 self-start" />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CategoryGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={grid} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-card bg-surface h-44 animate-pulse motion-reduce:animate-none lg:h-45",
          )}
        />
      ))}
    </div>
  );
}
