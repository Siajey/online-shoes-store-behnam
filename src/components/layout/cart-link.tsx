"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCartCount } from "@/features/cart/use-cart";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { layoutCopy } from "./copy";

type ViewProps = {
  count: number;
  className?: string;
  badgeClassName?: string;
  children: ReactNode;
};

const MAX_SHOWN = 99;

/** لینک سبد خرید با شمارنده‌ی کالاها. */
export function CartLinkView({ count, className, badgeClassName, children }: ViewProps) {
  const shown = count > MAX_SHOWN ? `${toPersianDigits(MAX_SHOWN)}+` : toPersianDigits(count);
  const label = count > 0 ? layoutCopy.cartWithCount(toPersianDigits(count)) : layoutCopy.cart;
  return (
    <Link href="/cart" aria-label={label} className={className}>
      {children}
      {count > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            "bg-danger text-fg absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px]",
            badgeClassName ?? "-end-0.5 -top-0.5",
          )}
        >
          {shown}
        </span>
      )}
    </Link>
  );
}

/** نسخه‌ی متصل به سبد. روی سرور صفر نشان می‌دهد و بعد از بارگذاری عدد واقعی جایگزین می‌شود. */
export function CartLink(props: Omit<ViewProps, "count">) {
  return <CartLinkView count={useCartCount()} {...props} />;
}
