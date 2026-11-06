import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { infoCopy } from "@/features/info/copy";

/** نمای خالص نتیجه‌ی پرداخت. ☐ با آماده شدن API پرداخت، شماره‌ی سفارش و وضعیت واقعی از سرور بیاید. */
export function ResultView({ kind }: { kind: "success" | "failed" }) {
  const c = infoCopy.result[kind];
  return (
    <main className="mx-auto flex w-full max-w-300 flex-col items-center gap-4 px-4 py-20 text-center lg:px-8">
      <h1 className={`text-3xl font-semibold ${kind === "success" ? "text-ok" : "text-danger"}`}>
        {c.title}
      </h1>
      <p role="status" className="text-fg-muted max-w-lg leading-8">
        {c.text}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link href={c.primary.href} className={buttonVariants({ size: "lg" })}>
          {c.primary.label}
        </Link>
        <Link
          href={c.secondary.href}
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          {c.secondary.label}
        </Link>
      </div>
    </main>
  );
}
