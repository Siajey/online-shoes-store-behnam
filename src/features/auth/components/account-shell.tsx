import Link from "next/link";
import type { ReactNode } from "react";
import type { AccountKey } from "../account-nav";
import { authCopy } from "../copy";
import { AccountSidebar } from "./account-sidebar";

type Props = { current: AccountKey; title: string; children: ReactNode };

/**
 * قالب بخش حساب. دسکتاپ: نوار کناری + محتوا. موبایل: فقط محتوا؛
 * صفحه‌ی خلاصه خودش فهرست منو است و بقیه‌ی صفحه‌ها لینک بازگشت دارند.
 */
export function AccountShell({ current, title, children }: Props) {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <AccountSidebar current={current} />
        </aside>
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
