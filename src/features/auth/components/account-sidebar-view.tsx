import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  CubeIcon,
  HeartIcon,
  LogoutIcon,
  PencilIcon,
  PinIcon,
  ShieldIcon,
  SummaryIcon,
} from "@/components/layout/icons";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { ACCOUNT_LINKS, type AccountKey } from "../account-nav";
import { authCopy } from "../copy";
import { AccountAvatar } from "./account-avatar";

export const ACCOUNT_ICONS: Record<AccountKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  summary: SummaryIcon,
  orders: CubeIcon,
  addresses: PinIcon,
  favourites: HeartIcon,
  profile: PencilIcon,
  security: ShieldIcon,
};

type Props = {
  current: AccountKey;
  name?: string;
  phone?: string;
  onLogout: () => void;
  loggingOut: boolean;
  error?: string;
};

const ORDER: AccountKey[] = ["summary", "orders", "addresses", "favourites", "profile", "security"];

/** نمای خالص نوار کناری حساب (دسکتاپ): کارت کاربر، بخش‌ها با آیکون و خروج. */
export function AccountSidebarView({ current, name, phone, onLogout, loggingOut, error }: Props) {
  const links = ORDER.map((k) => ACCOUNT_LINKS.find((l) => l.key === k)).filter(
    (l): l is (typeof ACCOUNT_LINKS)[number] => Boolean(l),
  );
  return (
    <div className="rounded-card bg-surface flex flex-col gap-4 p-4">
      <div aria-label={authCopy.userCardLabel} className="flex items-center gap-3 p-2">
        <AccountAvatar name={name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name || authCopy.nameFallback}</p>
          {phone && (
            <p dir="ltr" className="text-fg-muted text-start text-xs">
              {toPersianDigits(phone)}
            </p>
          )}
        </div>
      </div>
      <nav aria-label={authCopy.navLabel}>
        <ul className="flex flex-col gap-1">
          {links.map((l) => {
            const Icon = ACCOUNT_ICONS[l.key];
            const active = l.key === current;
            return (
              <li key={l.key}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-visible:outline-brand flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
                    active ? "bg-surface-2 text-brand" : "text-fg hover:bg-surface-2",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        aria-busy={loggingOut || undefined}
        className="text-danger focus-visible:outline-brand hover:bg-surface-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 motion-reduce:transition-none"
      >
        <LogoutIcon className="size-5 shrink-0" />
        {authCopy.logout}
      </button>
      {error && (
        <p role="alert" className="text-danger px-2 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
