import Link from "next/link";
import { cn } from "@/lib/cn";
import { categoryCopy } from "../copy";
import { categoryHref } from "../routes";
import type { CategoryTrail } from "../trail";
import type { Category } from "../types";

function Chip({ href, active, children }: { href: string; active: boolean; children: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "focus-visible:outline-brand inline-flex h-10 flex-none items-center rounded-full px-4 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
        active
          ? "bg-brand text-on-brand font-medium"
          : "bg-surface-2 text-fg-secondary hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

const row = "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0";

/** نوار فیلتر دسته‌بندی: ردیف دسته‌های اصلی و، با انتخاب یکی، ردیف زیردسته‌های آن. */
export function CategoryFilter({
  categories,
  trail,
}: {
  categories: Category[];
  trail: CategoryTrail;
}) {
  const subcategories = trail.parent?.children ?? [];

  return (
    <div className="mt-5 flex flex-col gap-3">
      <nav aria-label={categoryCopy.filterLabel} className={row}>
        <Chip href="/products" active={!trail.active}>
          {categoryCopy.all}
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            href={categoryHref(category.slug)}
            active={trail.parent?.id === category.id}
          >
            {category.name}
          </Chip>
        ))}
      </nav>

      {trail.parent && subcategories.length > 0 && (
        <nav aria-label={categoryCopy.subFilterLabel} className={row}>
          <Chip
            href={categoryHref(trail.parent.slug)}
            active={trail.active?.id === trail.parent.id}
          >
            {categoryCopy.allIn(trail.parent.name)}
          </Chip>
          {subcategories.map((child) => (
            <Chip
              key={child.id}
              href={categoryHref(child.slug)}
              active={trail.active?.id === child.id}
            >
              {child.name}
            </Chip>
          ))}
        </nav>
      )}
    </div>
  );
}
