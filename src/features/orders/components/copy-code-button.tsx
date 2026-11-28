"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ordersCopy as t } from "../copy";

/** کپی کد رهگیری در کلیپ‌بورد. اگر مرورگر اجازه ندهد بی‌صدا رد می‌شود. */
export function CopyCodeButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        void navigator.clipboard
          ?.writeText(value)
          .then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 2000);
          })
          .catch(() => undefined);
      }}
    >
      {done ? t.copied : t.copyCode}
    </Button>
  );
}
