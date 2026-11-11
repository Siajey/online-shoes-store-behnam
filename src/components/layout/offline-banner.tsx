"use client";

import { useSyncExternalStore } from "react";
import { errorCopy } from "@/features/errors/copy";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/** نمای خالص؛ وقتی آنلاین است چیزی رندر نمی‌شود. */
export function OfflineBannerView({ online }: { online: boolean }) {
  if (online) return null;
  return (
    <div
      role="status"
      className="bg-surface-2 text-danger border-line border-b px-4 py-2 text-center text-sm"
    >
      {errorCopy.offline}
    </div>
  );
}

/** روی سرور و قبل از hydrate آنلاین فرض می‌شود تا نوار اشتباهی دیده نشود. */
export function OfflineBanner() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  return <OfflineBannerView online={online} />;
}
