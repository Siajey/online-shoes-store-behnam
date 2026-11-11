import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { adminCopy } from "../copy";
import type { AdminAccess } from "../guard";

/** نمای خالص دروازه؛ به store ورود وابسته نیست تا بدون تنظیم env قابل تست باشد. */
export function AdminGateView({
  access,
  children,
  onRetry,
}: {
  access: AdminAccess;
  children: ReactNode;
  onRetry?: () => void;
}) {
  if (access === "ok") return <>{children}</>;
  if (access === "forbidden") {
    return (
      <div className="mx-auto max-w-120 px-4 py-16">
        <StateMessage tone="error">
          <strong className="block text-base">{adminCopy.forbiddenTitle}</strong>
          {adminCopy.forbiddenText}
        </StateMessage>
        <div className="mt-4 text-center">
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            {adminCopy.backToSite}
          </Link>
        </div>
      </div>
    );
  }
  if (access === "error") {
    return (
      <div className="mx-auto max-w-120 px-4 py-16">
        <StateMessage tone="error">{adminCopy.errorText}</StateMessage>
        <div className="mt-4 text-center">
          <Button variant="secondary" onClick={onRetry}>
            {adminCopy.retry}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-120 px-4 py-16">
      <StateMessage>{adminCopy.loading}</StateMessage>
    </div>
  );
}
