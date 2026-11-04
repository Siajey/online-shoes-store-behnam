"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** روی سرور false و بعد از هیدریت در مرورگر true؛ برای نشان ندادن «خالی» پیش از خواندن حافظه. */
export function useClientReady(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
