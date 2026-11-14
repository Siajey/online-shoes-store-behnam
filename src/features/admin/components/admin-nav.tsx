"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/cn";
import { adminCopy } from "../copy";
import { BadgeIcon, BoxIcon, ExitIcon, TagIcon, UsersIcon } from "./admin-icons";

type Item = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const ITEMS: readonly Item[] = [
  { href: "/admin/products", label: adminCopy.nav.products, Icon: BoxIcon },
  { href: "/admin/categories", label: adminCopy.nav.categories, Icon: TagIcon },
  { href: "/admin/brands", label: adminCopy.nav.brands, Icon: BadgeIcon },
  { href: "/admin/users", label: adminCopy.nav.users, Icon: UsersIcon },
];

const base =
  "focus-visible:outline-brand flex items-center gap-3 rounded-2xl px-4 py-3 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2";

export function AdminNavView({ pathname }: { pathname: string | null }) {
  return (
    <nav
      aria-label={adminCopy.navLabel}
      className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-4 lg:pb-0"
    >
      {ITEMS.map(({ href, label, Icon }) => {
        const active = !!pathname && pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              base,
              active ? "bg-surface-2 text-brand" : "text-fg-secondary hover:bg-surface-2",
            )}
          >
            <Icon />
            {label}
          </Link>
        );
      })}
      <Link href="/" className={cn(base, "text-fg-secondary hover:bg-surface-2 lg:mt-6")}>
        <ExitIcon />
        {adminCopy.backToSite}
      </Link>
    </nav>
  );
}

export function AdminNav() {
  return <AdminNavView pathname={usePathname()} />;
}
