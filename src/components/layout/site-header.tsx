import Link from "next/link";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { toPersianDigits } from "@/lib/format";
import { BrandLogo } from "./brand-logo";
import { layoutCopy } from "./copy";
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "./icons";
import { MainNav } from "./main-nav";

const iconButton =
  "relative flex size-11 items-center justify-center rounded-full bg-surface-2 text-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none";

export function SiteHeader({ cartCount = 0 }: { cartCount?: number }) {
  const cartLabel =
    cartCount > 0 ? layoutCopy.cartWithCount(toPersianDigits(cartCount)) : layoutCopy.cart;

  return (
    <header>
      {/* موبایل: نوار باریک بالا */}
      <div className="flex h-16 items-center justify-between px-4 lg:hidden">
        <BrandLogo className="text-lg" />
        <ThemeToggle />
      </div>

      {/* دسکتاپ */}
      <div className="bg-surface hidden h-18 lg:flex lg:items-center">
        <div className="mx-auto flex w-full max-w-300 items-center gap-8 px-8">
          <BrandLogo />
          <MainNav />
          <form action="/products" role="search" className="w-70">
            <label className="bg-surface-2 text-fg-muted flex h-11 items-center gap-2 rounded-full px-4">
              <SearchIcon className="size-[18px]" />
              <span className="sr-only">{layoutCopy.searchLabel}</span>
              <input
                type="search"
                name="q"
                placeholder={layoutCopy.searchPlaceholder}
                className="text-fg placeholder:text-fg-muted min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
          </form>
          <div className="flex gap-2.5">
            <ThemeToggle />
            <Link href="/favourites" aria-label={layoutCopy.favourites} className={iconButton}>
              <HeartIcon />
            </Link>
            <Link href="/cart" aria-label={cartLabel} className={iconButton}>
              <BagIcon />
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="bg-danger text-fg absolute -end-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px]"
                >
                  {toPersianDigits(cartCount)}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              aria-label={layoutCopy.account}
              className="bg-brand text-on-brand focus-visible:outline-brand flex size-11 items-center justify-center rounded-full transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              <UserIcon />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
