"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoeIllustration } from "@/components/illustrations/shoe-illustration";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { productCopy as t } from "../copy";

const MAX_THUMBS = 5;

/** گالری: تصویر بزرگ و تصویرهای کوچک قابل‌انتخاب (فقط وقتی بیش از یک تصویر هست). */
export function ProductGallery({ images, name }: { images: readonly string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const list = images.slice(0, MAX_THUMBS);
  const current = list[Math.min(index, list.length - 1)];

  return (
    <div className="flex flex-col gap-4" role="group" aria-label={t.galleryLabel}>
      <div className="bg-surface relative flex h-80 items-center justify-center overflow-hidden rounded-[40px] lg:h-120">
        {current ? (
          // unoptimized: تا دامنه‌ی تصاویر نهایی نشده، تنظیم images.remotePatterns لازم نیست.
          <Image
            key={current}
            src={current}
            alt={name}
            fill
            unoptimized
            priority
            sizes="(min-width: 960px) 560px, 100vw"
            className="object-cover"
          />
        ) : (
          <ShoeIllustration className="w-64 -rotate-8" />
        )}
      </div>

      {list.length > 1 && (
        <ul className="grid grid-cols-5 gap-3">
          {list.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                aria-pressed={i === index}
                aria-label={t.showImage(toPersianDigits(i + 1))}
                onClick={() => setIndex(i)}
                className={cn(
                  "bg-surface focus-visible:outline-brand relative block aspect-square w-full overflow-hidden rounded-3xl border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
                  i === index ? "border-brand" : "hover:border-line border-transparent",
                )}
              >
                <Image src={src} alt="" fill unoptimized sizes="100px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
