import type { BadgeVariant } from "@/components/ui/badge";
import type { UserRole, UserStatus } from "./types";

export const ROLE_LABEL: Record<UserRole, string> = { admin: "مدیر", user: "کاربر" };
export const STATUS_LABEL: Record<UserStatus, string> = {
  active: "فعال",
  registered: "ثبت‌نام‌شده",
  inactive: "غیرفعال",
};
export const STATUS_BADGE: Record<UserStatus, BadgeVariant> = {
  active: "success",
  registered: "warning",
  inactive: "neutral",
};

export type UserAction = "makeAdmin" | "makeUser" | "activate" | "deactivate";

export const ACTION_LABEL: Record<UserAction, string> = {
  makeAdmin: "ارتقا به مدیر",
  makeUser: "تبدیل به کاربر عادی",
  activate: "فعال‌سازی",
  deactivate: "غیرفعال‌سازی",
};

/** اعمال مجاز برای یک کاربر؛ فقط مدیر ↔ کاربر و فعال ↔ غیرفعال. */
export function userActions(user: { role: UserRole; status: UserStatus }): UserAction[] {
  return [
    user.role === "admin" ? "makeUser" : "makeAdmin",
    user.status === "inactive" ? "activate" : "deactivate",
  ];
}

export function actionPatch(action: UserAction): { role?: UserRole; status?: UserStatus } {
  switch (action) {
    case "makeAdmin":
      return { role: "admin" };
    case "makeUser":
      return { role: "user" };
    case "activate":
      return { status: "active" };
    case "deactivate":
      return { status: "inactive" };
  }
}

/** تغییر نقش و غیرفعال‌سازی پیامد بزرگ‌تری دارند و تأیید می‌خواهند. */
export const needsConfirm = (action: UserAction): boolean => action !== "activate";
