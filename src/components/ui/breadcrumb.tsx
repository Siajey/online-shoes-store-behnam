import Link from "next/link";
import { Fragment } from "react";

export type BreadcrumbItem = { label: string; href?: string };

/** مسیر صفحه. آیتم آخر (بدون href) صفحه‌ی فعلی است. */
export function Breadcrumb({ items, label }: { items: BreadcrumbItem[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ol className="text-fg-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {items.map((item, index) => (
          <Fragment key={`${index}-${item.label}`}>
            {index > 0 && (
              <li aria-hidden="true" role="presentation">
                /
              </li>
            )}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-fg transition-colors motion-reduce:transition-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-fg-secondary">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
