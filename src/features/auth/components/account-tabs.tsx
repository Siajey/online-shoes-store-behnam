import Link from "next/link";
import { cn } from "@/lib/cn";
import { authCopy } from "../copy";

const TABS = [
  { key: "profile", href: "/account", label: authCopy.tabProfile },
  { key: "addresses", href: "/account/addresses", label: authCopy.tabAddresses },
] as const;

/** زبانه‌های بخش حساب. صفحه‌ی فعلی از بیرون داده می‌شود (بدون usePathname، سازگار با ایستا). */
export function AccountTabs({ current }: { current: (typeof TABS)[number]["key"] }) {
  return (
    <nav aria-label={authCopy.tabsLabel} className="mb-6 flex gap-2">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === current ? "page" : undefined}
          className={cn(
            "focus-visible:outline-brand rounded-full px-5 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
            tab.key === current
              ? "bg-brand text-on-brand"
              : "bg-surface-2 text-fg hover:bg-surface",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
