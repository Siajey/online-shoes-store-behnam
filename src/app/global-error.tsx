"use client";

import { useEffect } from "react";
import { DEFAULT_THEME } from "@/features/theme/theme";
import { errorCopy } from "@/features/errors/copy";
import "./globals.css";

/** آخرین خط دفاع: وقتی خود چیدمان ریشه خطا بدهد. باید html و body خودش را داشته باشد. */
export default function GlobalError({
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
  return (
    <html lang="fa" dir="rtl" data-theme={DEFAULT_THEME}>
      <body className="bg-page text-fg font-sans antialiased">
        <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
          <h1 className="text-3xl font-semibold">{errorCopy.title}</h1>
          <p role="alert" className="text-fg-muted leading-8">
            {errorCopy.text}
          </p>
          <button
            type="button"
            onClick={reset}
            className="bg-brand text-on-brand mt-4 rounded-full px-8 py-3 text-base"
          >
            {errorCopy.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
