import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { toPersianDigits } from "@/lib/format";
import { authCopy } from "../copy";
import type { User } from "../types";

const STATUS: Record<string, { label: string; variant: BadgeVariant }> = {
  active: { label: authCopy.statusActive, variant: "success" },
  registered: { label: authCopy.statusRegistered, variant: "neutral" },
};

type Props = {
  user: User;
  onLogout: () => void;
  loggingOut: boolean;
  /** خطای خروج (مثلاً قطعی اینترنت) */
  error?: string;
};

/** نمای خالص صفحه‌ی حساب. */
export function AccountView({ user, onLogout, loggingOut, error }: Props) {
  const status = STATUS[user.status];
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-card bg-surface flex flex-col gap-4 p-6">
        <dl className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-fg-muted text-sm">{authCopy.accountPhone}</dt>
            <dd dir="ltr" className="text-lg font-medium">
              {toPersianDigits(user.phoneNumber)}
            </dd>
          </div>
          {status && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-fg-muted text-sm">{authCopy.accountStatus}</dt>
              <dd>
                <Badge variant={status.variant} dot>
                  {status.label}
                </Badge>
              </dd>
            </div>
          )}
        </dl>
        <p className="text-fg-muted border-line border-t pt-4 text-sm leading-7">
          {authCopy.accountSoon}
        </p>
      </section>

      {error && (
        <p role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
      <div>
        <Button variant="outline" size="lg" onClick={onLogout} loading={loggingOut}>
          {authCopy.logout}
        </Button>
      </div>
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">{authCopy.accountLoading}</span>
      <div
        aria-hidden="true"
        className="rounded-card bg-surface h-40 animate-pulse motion-reduce:animate-none"
      />
    </div>
  );
}

export function AccountError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <StateMessage tone="error" className="w-full">
        {message}
      </StateMessage>
      <Button variant="outline" onClick={onRetry}>
        {authCopy.retry}
      </Button>
    </div>
  );
}
