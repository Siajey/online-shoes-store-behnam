import Link from "next/link";
import { ShoeIllustration } from "@/components/illustrations/shoe-illustration";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { landingCopy } from "../copy";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-8 lg:min-h-120 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex-1">
          <Badge variant="brand">{landingCopy.heroTag}</Badge>
          <h1 className="mt-5 text-4xl leading-[1.35] font-semibold lg:text-[56px]">
            {landingCopy.heroTitle}
          </h1>
          <p className="text-fg-muted mt-5 max-w-120 text-base leading-9 font-light lg:text-lg">
            {landingCopy.heroText}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className={buttonVariants({ size: "lg" })}>
              {landingCopy.heroCta}
            </Link>
            <a href="#categories" className={buttonVariants({ size: "lg", variant: "secondary" })}>
              {landingCopy.heroSecondaryCta}
            </a>
          </div>
        </div>

        <div className="bg-surface relative flex h-72 items-center justify-center rounded-[40px] lg:h-120 lg:w-130 lg:flex-none">
          <div className="bg-surface-2 size-56 rounded-full lg:size-95" />
          <ShoeIllustration className="absolute w-64 -rotate-8 lg:w-110" />
        </div>
      </div>
    </section>
  );
}
