"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ShoeIllustration } from "@/components/illustrations/shoe-illustration";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { productCopy as t } from "../copy";

/** سقف تصاویر هر محصول در بک‌اند ۱۲ است. */
export const MAX_GALLERY_IMAGES = 12;

const arrowButton =
  "bg-surface/90 text-fg hover:bg-surface focus-visible:outline-brand absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none";

/** فلش رو به جهت «بعدی» (در راست‌به‌چپ خودکار برعکس می‌شود). */
function Chevron({ forward }: { forward: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="rtl:-scale-x-100"
    >
      <path d={forward ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} />
    </svg>
  );
}

/**
 * گالری اسلایدری: تصویر بزرگ با فلش قبلی/بعدی و شمارنده،
 * و نوار تصویرهای کوچک که افقی اسکرول می‌شود و تصویر انتخاب‌شده در دید می‌ماند.
 */
export function ProductGallery({ images, name }: { images: readonly string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const list = images.slice(0, MAX_GALLERY_IMAGES);
  const count = list.length;
  const active = Math.min(index, Math.max(count - 1, 0));
  const current = list[active];
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    thumbs.current[active]?.scrollIntoView({
      inline: "nearest",
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active]);

  const go = (step: 1 | -1) => setIndex((active + step + count) % count);

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

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label={t.galleryPrev}
              onClick={() => go(-1)}
              className={cn(arrowButton, "start-3")}
            >
              <Chevron forward={false} />
            </button>
            <button
              type="button"
              aria-label={t.galleryNext}
              onClick={() => go(1)}
              className={cn(arrowButton, "end-3")}
            >
              <Chevron forward />
            </button>
            <span
              role="status"
              aria-label={t.galleryCounter(toPersianDigits(active + 1), toPersianDigits(count))}
              className="bg-surface/90 text-fg-secondary absolute start-1/2 bottom-3 -translate-x-1/2 rounded-full px-3 py-1 text-xs rtl:translate-x-1/2"
            >
              {toPersianDigits(active + 1)} / {toPersianDigits(count)}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="flex snap-x gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <li key={src} className="w-20 shrink-0 snap-start lg:w-24">
              <button
                type="button"
                ref={(el) => {
                  thumbs.current[i] = el;
                }}
                aria-pressed={i === active}
                aria-label={t.showImage(toPersianDigits(i + 1))}
                onClick={() => setIndex(i)}
                className={cn(
                  "bg-surface focus-visible:outline-brand relative block aspect-square w-full overflow-hidden rounded-3xl border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
                  i === active ? "border-brand" : "hover:border-line border-transparent",
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
