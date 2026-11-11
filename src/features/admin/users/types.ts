export type UserRole = "admin" | "user";
export type UserStatus = "active" | "registered" | "inactive";

export const ROLES: readonly UserRole[] = ["admin", "user"];
export const STATUSES: readonly UserStatus[] = ["active", "registered", "inactive"];

export type AdminUser = {
  id: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type UserFilters = {
  role?: UserRole;
  status?: UserStatus;
  /** شمارهٔ کامل و نرمال‌شده؛ بک‌اند فقط تطبیق دقیق دارد */
  phoneNumber?: string;
};
