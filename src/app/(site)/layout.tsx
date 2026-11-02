import { Suspense } from "react";
import { MobileNav, MobileNavBar } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/** چیدمان صفحه‌های فروشگاه (هدر، فوتر و منوی پایین موبایل). پنل ادمین بعداً چیدمان جدا دارد. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="pb-28 lg:pb-0">
        {children}
        <SiteFooter />
      </div>
      {/* MobileNav آدرس زمان درخواست را می‌خواند؛ تا برسد، منو بدون حالت «فعال» نشان داده می‌شود. */}
      <Suspense fallback={<MobileNavBar pathname={null} />}>
        <MobileNav />
      </Suspense>
    </>
  );
}
