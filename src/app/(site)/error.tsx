"use client";

import { useEffect } from "react";
import { ErrorView } from "@/features/errors/components/error-view";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // ☐ وقتی Sentry یا ابزار مشابه اضافه شد، خطا را اینجا گزارش کنید.
    console.error(error);
  }, [error]);
  return <ErrorView onRetry={reset} />;
}
