"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/cn";
import { layoutCopy } from "./copy";
import { isActivePath } from "./nav";

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav aria-label={layoutCopy.mainNav} className="flex flex-1 gap-6">
      {mainNav.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "hover:text-fg focus-visible:outline-brand text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none",
              active ? "text-fg font-medium" : "text-fg-muted",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
