import Image from "next/image";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { adminCopy } from "../copy";
import { AdminNav } from "./admin-nav";
import { AdminTopbar } from "./admin-topbar";

/** قاب پنل: سایدبار (در موبایل بالای صفحه)، نوار بالا و محتوا. */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-page min-h-screen lg:flex">
      <aside className="bg-surface border-line lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:flex-none lg:overflow-y-auto lg:border-e">
        <div className="flex items-center gap-3 p-4 lg:p-6">
          <Image
            src="/brand/logo.jpg"
            alt=""
            width={76}
            height={76}
            className="size-11 rounded-xl"
          />
          <div>
            <div className="text-base font-semibold">{siteConfig.name}</div>
            <div className="text-fg-muted text-xs">{adminCopy.panelSubtitle}</div>
          </div>
        </div>
        <AdminNav />
      </aside>
      <div className="min-w-0 flex-1">
        <AdminTopbar />
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
