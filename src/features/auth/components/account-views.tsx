import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { authCopy } from "../copy";

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
