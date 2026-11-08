"use client";

import { useEffect } from "react";
import { markWelcomeSeen, safeLocalStorage } from "../welcome";
import { WelcomeView } from "./welcome-view";

/** نسخه‌ی متصل: به‌محض دیده شدن، ثبت می‌شود تا بار بعد خودکار نیاید. */
export function WelcomeScreen() {
  useEffect(() => {
    markWelcomeSeen(safeLocalStorage());
  }, []);
  return <WelcomeView />;
}
