import Link from "next/link";
import type { ReactNode } from "react";
import { adminCopy } from "../copy";
import { AdminNav } from "./admin-nav";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold lg:text-2xl">{adminCopy.title}</h1>
        <Link href="/" className="text-brand text-sm">
          {adminCopy.backToSite}
        </Link>
      </header>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="lg:w-56 lg:flex-none">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
