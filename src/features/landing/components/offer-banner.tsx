import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { landingCopy } from "../copy";

/**
 * بنر پیشنهاد ویژه؛ فقط در دسکتاپ دیده می‌شود.
 * درصد تخفیف یا قیمت نمایش داده نمی‌شود چون بک‌اند هنوز تخفیف ندارد؛
 * دکمه به لیست محصولات با مرتب‌سازی ارزان‌ترین می‌رود.
 */
export function OfferBanner() {
  return (
    <section
      aria-labelledby="offer-title"
      className="mx-auto hidden w-full max-w-300 px-8 py-10 lg:block"
    >
      <div className="rounded-card bg-brand text-on-brand flex items-center justify-between gap-8 p-10">
        <div className="max-w-130">
          <h2 id="offer-title" className="text-3xl leading-[1.5] font-semibold">
            {landingCopy.offerTitle}
          </h2>
          <p className="mt-3 text-base leading-8 opacity-90">{landingCopy.offerText}</p>
        </div>
        <Link
          href="/products?sort=price-asc"
          className={buttonVariants({ size: "lg", variant: "secondary" })}
        >
          {landingCopy.offerCta}
        </Link>
      </div>
    </section>
  );
}
