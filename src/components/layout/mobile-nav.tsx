"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { layoutCopy } from "./copy";
import { BagIcon, BellIcon, HeartIcon, HomeIcon, UserIcon } from "./icons";
import { isActivePath } from "./nav";

type Item = { href: string; label: string; icon: ReactNode };

const left: Item[] = [
  { href: "/", label: layoutCopy.home, icon: <HomeIcon className="size-[26px]" /> },
  {
    href: "/favourites",
    label: layoutCopy.favourites,
    icon: <HeartIcon className="size-[26px]" />,
  },
];
const right: Item[] = [
  {
    href: "/account/orders",
    label: layoutCopy.ordersAndNotifications,
    icon: <BellIcon className="size-[26px]" />,
  },
  { href: "/account", label: layoutCopy.account, icon: <UserIcon className="size-[26px]" /> },
];

export function MobileNav() {
  const pathname = usePathname();

  const renderItem = (item: Item) => {
    const active = isActivePath(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "focus-visible:outline-brand flex size-12 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2",
          active ? "text-brand" : "text-fg-muted",
        )}
      >
        {item.icon}
      </Link>
    );
  };

  return (
    <nav
      aria-label={layoutCopy.mobileNav}
      className="bg-surface fixed inset-x-0 bottom-0 z-40 h-24 rounded-t-[32px] lg:hidden"
    >
      <div className="grid h-full grid-cols-5 items-center justify-items-center px-3">
        {left.map(renderItem)}
        <span aria-hidden="true" />
        {right.map(renderItem)}
      </div>
      <Link
        href="/cart"
        aria-label={layoutCopy.cart}
        className="bg-brand text-on-brand ring-page focus-visible:outline-brand absolute inset-x-0 -top-4 mx-auto flex size-18 items-center justify-center rounded-full ring-8 focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <BagIcon className="size-[30px]" />
      </Link>
    </nav>
  );
}
