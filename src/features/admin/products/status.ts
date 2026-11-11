import type { BadgeVariant } from "@/components/ui/badge";
import type { ProductStatus, StatusAction } from "./types";

export const STATUS_LABEL: Record<ProductStatus, string> = {
  draft: "پیش‌نویس",
  published: "منتشرشده",
  archived: "بایگانی‌شده",
};

export const STATUS_BADGE: Record<ProductStatus, BadgeVariant> = {
  draft: "warning",
  published: "success",
  archived: "neutral",
};

export const ACTION_LABEL: Record<StatusAction, string> = {
  publish: "انتشار",
  unpublish: "برگشت به پیش‌نویس",
  archive: "بایگانی",
};

/** مطابق ALLOWED_STATUS_TRANSITIONS بک‌اند: draft→published|archived، published→draft|archived، archived→draft */
export function allowedActions(status: ProductStatus): StatusAction[] {
  switch (status) {
    case "draft":
      return ["publish", "archive"];
    case "published":
      return ["unpublish", "archive"];
    case "archived":
      return ["unpublish"];
  }
}
