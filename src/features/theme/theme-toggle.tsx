"use client";

import { useSyncExternalStore } from "react";
import { themeCopy } from "./copy";
import { DEFAULT_THEME, THEME_STORAGE_KEY, nextTheme, parseTheme, type Theme } from "./theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => parseTheme(document.documentElement.dataset.theme);
const getServerSnapshot = (): Theme => DEFAULT_THEME;

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = nextTheme(theme);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // حالت خصوصی مرورگر یا ذخیره‌سازی مسدود: تغییر فقط برای همین بازدید می‌ماند.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? themeCopy.switchToLight : themeCopy.switchToDark}
      className={
        "bg-surface-2 text-fg focus-visible:outline-brand flex size-11 items-center justify-center rounded-full transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none " +
        (className ?? "")
      }
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}
