"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { ProductReviews, type ReviewProduct } from "@/features/reviews/components/product-reviews";
import { reviewsCopy } from "@/features/reviews/copy";
import { useProductReviews } from "@/features/reviews/use-reviews";
import { productCopy as t } from "../copy";

type TabKey = "specs" | "description" | "reviews";

type Props = {
  product: ReviewProduct;
  /** محتوای سروری هر تب؛ هر سه در HTML می‌آیند و فقط تب فعال دیده می‌شود. */
  specs: ReactNode;
  description: ReactNode;
};

/** تب‌های مشخصات، توضیحات و نظرات. آدرس #reviews تب نظرات را باز می‌کند (لینک امتیاز کنار عنوان). */
export function ProductTabs({ product, specs, description }: Props) {
  const [tab, setTab] = useState<TabKey>("specs");
  const { summary } = useProductReviews(product.id);

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#reviews") {
        setTab("reviews");
        document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    // بار اول بعد از رسم صفحه بررسی می‌شود (آدرس ممکن است از قبل #reviews داشته باشد).
    const frame = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "specs", label: t.tabSpecs },
    { key: "description", label: t.tabDescription },
    {
      key: "reviews",
      label:
        summary.count > 0
          ? reviewsCopy.tabWithCount(toPersianDigits(summary.count))
          : reviewsCopy.tab,
    },
  ];

  return (
    <section id="reviews" className="mt-16 scroll-mt-24">
      <div role="tablist" aria-label={t.tabsLabel} className="border-line flex gap-8 border-b">
        {tabs.map((x) => (
          <button
            key={x.key}
            type="button"
            role="tab"
            id={`tab-${x.key}`}
            aria-selected={tab === x.key}
            aria-controls={`panel-${x.key}`}
            onClick={() => setTab(x.key)}
            className={cn(
              "focus-visible:outline-brand -mb-px border-b-2 pb-4 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
              tab === x.key
                ? "border-brand text-fg font-medium"
                : "text-fg-muted hover:text-fg border-transparent",
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div role="tabpanel" id="panel-specs" aria-labelledby="tab-specs" hidden={tab !== "specs"}>
          {specs}
        </div>
        <div
          role="tabpanel"
          id="panel-description"
          aria-labelledby="tab-description"
          hidden={tab !== "description"}
        >
          {description}
        </div>
        <div
          role="tabpanel"
          id="panel-reviews"
          aria-labelledby="tab-reviews"
          hidden={tab !== "reviews"}
        >
          <ProductReviews product={product} />
        </div>
      </div>
    </section>
  );
}
