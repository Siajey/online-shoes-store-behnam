import Link from "next/link";
import { MENU_LINKS } from "../account-nav";
import { authCopy } from "../copy";

/** فهرست بخش‌های حساب (منوی موبایل و کارت‌های خلاصه در دسکتاپ). */
export function AccountMenu({ name }: { name?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-fg-secondary text-base">
        {name ? authCopy.greeting(name) : authCopy.greetingNoName}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {MENU_LINKS.map((l) => (
          <li key={l.key}>
            <Link
              href={l.href}
              className="rounded-card bg-surface focus-visible:outline-brand hover:bg-surface-2 flex flex-col gap-1 p-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              <span className="text-base font-medium">{l.label}</span>
              <span className="text-fg-muted text-sm">{l.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
