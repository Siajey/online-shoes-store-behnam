import { infoCopy } from "../copy";

/** یادداشت پیش‌نویس برای صفحه‌های حقوقی تا مالک بازبینی کند. */
export function DraftNote() {
  return (
    <p className="bg-surface-2 text-fg-muted rounded-card px-4 py-3 text-sm leading-7">
      {infoCopy.draftNote}
    </p>
  );
}
