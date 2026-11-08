import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ACCOUNT_LINKS, type AccountKey } from "../account-nav";
import { authCopy } from "../copy";

type Props = { current: AccountKey; title: string; children: ReactNode };

/**
 * قالب بخش حساب. دسکتاپ: نوار کناری + محتوا. موبایل: فقط محتوا؛
 * صفحه‌ی خلاصه خودش فهرست منو است و بقیه‌ی صفحه‌ها لینک بازگشت دارند.
 */
export function AccountShell({ current, title, children }: Props) {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-10">
        <nav aria-label={authCopy.navLabel} className="hidden lg:block">
          <ul className="rounded-card bg-surface flex flex-col gap-1 p-2">
            {ACCOUNT_LINKS.map((l) => (
              <li key={l.key}>
                <Link
                  href={l.href}
                  aria-current={l.key === current ? "page" : undefined}
                  className={cn(
                    "focus-visible:outline-brand block rounded-full px-5 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
                    l.key === current ? "bg-brand text-on-brand" : "text-fg hover:bg-surface-2",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0">
          {current !== "summary" && (
            <Link href="/account" className="text-brand mb-4 inline-block text-sm lg:hidden">
              {authCopy.backToAccount}
            </Link>
          )}
          <h1 className="mb-6 text-2xl font-semibold lg:text-3xl">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}
