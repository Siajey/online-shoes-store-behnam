"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { adminCopy } from "../copy";

const ITEMS = [
  { href: "/admin/products", label: adminCopy.nav.products, ready: true },
  { href: "/admin/categories", label: adminCopy.nav.categories, ready: false },
  { href: "/admin/brands", label: adminCopy.nav.brands, ready: false },
  { href: "/admin/variants", label: adminCopy.nav.variants, ready: false },
] as const;

export function AdminNavView({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label={adminCopy.navLabel} className="flex gap-2 overflow-x-auto lg:flex-col">
      {ITEMS.map((item) => {
        const active = !!pathname && pathname.startsWith(item.href);
        const base = "rounded-full px-4 py-2.5 text-sm whitespace-nowrap";
        return item.ready ? (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              base,
              active ? "bg-brand text-on-brand" : "text-fg-secondary hover:bg-surface-2",
            )}
          >
            {item.label}
          </Link>
        ) : (
          <span key={item.href} aria-disabled="true" className={cn(base, "text-fg-muted")}>
            {item.label} <span className="text-xs">({adminCopy.soon})</span>
          </span>
        );
      })}
    </nav>
  );
}

export function AdminNav() {
  return <AdminNavView pathname={usePathname()} />;
}
