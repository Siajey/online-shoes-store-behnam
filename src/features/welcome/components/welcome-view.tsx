import Link from "next/link";
import { ShoeIllustration } from "@/components/illustrations/shoe-illustration";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { welcomeCopy } from "../copy";

/** نمای خالص صفحه‌ی خوش‌آمدگویی (طبق طرح: نام برند، تصویر کفش، عنوان، توضیح و دکمه). */
export function WelcomeView({ onStart }: { onStart?: () => void }) {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden px-6 pt-6 pb-10">
      <div
        aria-hidden="true"
        className="bg-surface pointer-events-none absolute -start-24 -top-32 size-80 rounded-full"
      />
      <div
        aria-hidden="true"
        className="bg-surface-2 pointer-events-none absolute -end-16 top-64 size-40 rounded-full"
      />

      <p className="text-fg-muted relative z-10 self-end text-sm">{siteConfig.name}</p>

      <div className="relative z-10 mt-10 flex flex-1 items-center justify-center">
        <ShoeIllustration className="w-72 -rotate-8" />
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        <h1 className="text-3xl leading-[1.6] font-semibold">{welcomeCopy.title}</h1>
        <p className="text-fg-muted text-sm leading-7 font-light">{welcomeCopy.text}</p>
      </div>

      <div className="relative z-10 mt-10">
        <Link
          href="/"
          onClick={onStart}
          className={buttonVariants({ size: "lg", fullWidth: true })}
        >
          {welcomeCopy.start}
        </Link>
      </div>
    </main>
  );
}
