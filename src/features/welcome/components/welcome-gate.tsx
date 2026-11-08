"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DESKTOP_MIN_WIDTH, hasSeenWelcome, safeLocalStorage, shouldShowWelcome } from "../welcome";

/** در صفحه‌ی اصلی: کاربر موبایلِ تازه‌وارد را یک بار به /welcome می‌برد. چیزی نمایش نمی‌دهد. */
export function WelcomeGate() {
  const router = useRouter();
  useEffect(() => {
    const isMobile = window.matchMedia(`(max-width: ${DESKTOP_MIN_WIDTH - 1}px)`).matches;
    if (shouldShowWelcome({ isMobile, seen: hasSeenWelcome(safeLocalStorage()) })) {
      router.replace("/welcome");
    }
  }, [router]);
  return null;
}
