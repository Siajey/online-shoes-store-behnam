import Link from "next/link";
import { cn } from "@/lib/cn";
import { layoutCopy } from "./copy";
import { SearchIcon } from "./icons";

type Props = {
  /** عبارت فعلی جستجو (در صفحه‌ی محصولات) */
  defaultValue?: string;
  /** فیلدهای پنهانی که با جستجو حفظ می‌شوند (دسته، مرتب‌سازی، ...) */
  hidden?: readonly { name: string; value: string }[];
  /** اگر باشد و جستجویی فعال باشد، دکمه‌ی پاک کردن نشان داده می‌شود */
  clearHref?: string;
  /** حداقل طول عبارت (بک‌اند جستجوی کوتاه‌تر را نمی‌پذیرد) */
  minLength?: number;
  className?: string;
};

/** نوار جستجوی تمام‌عرض (موبایل). فرم GET ساده است و بدون جاوااسکریپت هم کار می‌کند. */
export function SearchBar({ defaultValue, hidden = [], clearHref, minLength, className }: Props) {
  return (
    <form action="/products" role="search" className={cn("w-full", className)}>
      {hidden.map((h) => (
        <input key={h.name} type="hidden" name={h.name} value={h.value} />
      ))}
      <label className="bg-surface text-fg-muted focus-within:outline-brand flex h-12 items-center gap-3 rounded-full px-4 focus-within:outline-2">
        <SearchIcon className="size-5 shrink-0" />
        <span className="sr-only">{layoutCopy.searchLabel}</span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          minLength={minLength}
          maxLength={100}
          enterKeyHint="search"
          placeholder={layoutCopy.searchPlaceholder}
          className="text-fg placeholder:text-fg-muted min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        {clearHref && defaultValue && (
          <Link
            href={clearHref}
            aria-label={layoutCopy.searchClear}
            className="text-fg-muted hover:text-fg shrink-0 text-lg leading-none"
          >
            ×
          </Link>
        )}
      </label>
      <button type="submit" className="sr-only">
        {layoutCopy.searchLabel}
      </button>
    </form>
  );
}
