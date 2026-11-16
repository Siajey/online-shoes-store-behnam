import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  ChevronStartIcon,
  CubeIcon,
  HeartIcon,
  LogoutIcon,
  PencilIcon,
  PinIcon,
  ShieldIcon,
  StarIcon,
} from "@/components/layout/icons";
import { buttonVariants } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/format";
import { authCopy } from "../copy";
import { AccountAvatar } from "./account-avatar";

type Item = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const ITEMS: readonly Item[] = [
  { href: "/account/orders", label: authCopy.navOrders, Icon: CubeIcon },
  { href: "/favourites", label: authCopy.navFavourites, Icon: HeartIcon },
  { href: "/account/addresses", label: authCopy.navAddresses, Icon: PinIcon },
  { href: "/account/reviews", label: authCopy.navReviews, Icon: StarIcon },
  { href: "/account/security", label: authCopy.navSecurity, Icon: ShieldIcon },
];

type Props = {
  name?: string;
  phone?: string;
  onLogout: () => void;
  loggingOut: boolean;
  error?: string;
};

/**
 * خلاصه‌ی حساب. موبایل: کارت کاربر، فهرست بخش‌ها با آیکون و فلش، و ردیف خروج.
 * دسکتاپ: فقط کارت خوش‌آمد (بخش‌ها در نوار کناری هستند).
 */
export function AccountMenu({ name, phone, onLogout, loggingOut, error }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <section
        aria-label={authCopy.userCardLabel}
        className="rounded-card bg-surface flex items-center gap-4 p-5"
      >
        <AccountAvatar name={name} className="size-14 lg:hidden" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold lg:text-xl">
            {name ? authCopy.greeting(name) : authCopy.greetingNoName}
          </h2>
          {phone && (
            <p dir="ltr" className="text-fg-muted text-start text-sm lg:hidden">
              {toPersianDigits(phone)}
            </p>
          )}
          <p className="text-fg-secondary mt-1 hidden text-sm lg:block">{authCopy.accountSoon}</p>
        </div>
        <Link
          href="/account/profile"
          aria-label={authCopy.editProfileShort}
          className="text-fg-muted hover:text-fg focus-visible:outline-brand rounded-full p-2 focus-visible:outline-2 lg:hidden"
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          href="/account/profile"
          className={buttonVariants({
            variant: "secondary",
            size: "sm",
            className: "max-lg:hidden",
          })}
        >
          {authCopy.editProfileShort}
        </Link>
      </section>

      <ul className="rounded-card bg-surface flex flex-col px-4 lg:hidden">
        {ITEMS.map(({ href, label, Icon }) => (
          <li key={href} className="border-line border-b last:border-b-0">
            <Link
              href={href}
              className="focus-visible:outline-brand flex items-center gap-3 py-3 focus-visible:outline-2"
            >
              <span className="bg-surface-2 flex size-11 shrink-0 items-center justify-center rounded-xl">
                <Icon className="size-5" strokeWidth={1.6} />
              </span>
              <span className="flex-1 text-sm">{label}</span>
              <ChevronStartIcon className="text-fg-muted size-5" />
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        aria-busy={loggingOut || undefined}
        className="rounded-card bg-surface text-danger focus-visible:outline-brand flex items-center justify-center gap-2 p-4 text-sm font-medium focus-visible:outline-2 disabled:opacity-50 lg:hidden"
      >
        <LogoutIcon className="size-5" strokeWidth={1.7} />
        {authCopy.logout}
      </button>
      {error && (
        <p role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
