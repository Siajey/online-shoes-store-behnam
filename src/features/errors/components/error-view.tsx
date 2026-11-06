import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { errorCopy } from "../copy";

/** نمای خالص خطای صفحه. جزئیات فنی خطا عمداً به کاربر نشان داده نمی‌شود. */
export function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-300 flex-col items-center gap-4 px-4 py-20 text-center lg:px-8">
      <h1 className="text-3xl font-semibold">{errorCopy.title}</h1>
      <p role="alert" className="text-fg-muted max-w-md leading-8">
        {errorCopy.text}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={onRetry}>
          {errorCopy.retry}
        </Button>
        <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          {errorCopy.home}
        </Link>
      </div>
    </main>
  );
}
