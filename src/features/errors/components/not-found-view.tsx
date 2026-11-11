import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { errorCopy } from "../copy";

/** ۴۰۴ سراسری (آدرس‌های ناشناخته و بخش‌های بیرون از چیدمان فروشگاه مثل پنل). */
export function NotFoundView() {
  return (
    <main className="mx-auto flex w-full max-w-300 flex-col items-center gap-4 px-4 py-20 text-center lg:px-8">
      <h1 className="text-3xl font-semibold">{errorCopy.notFoundTitle}</h1>
      <p className="text-fg-muted max-w-md leading-8">{errorCopy.notFoundText}</p>
      <Link href="/" className={buttonVariants({ size: "lg", className: "mt-4" })}>
        {errorCopy.home}
      </Link>
    </main>
  );
}
