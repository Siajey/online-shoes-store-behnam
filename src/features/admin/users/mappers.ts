import type { AdminUserDto } from "./dto";
import { ROLES, STATUSES, type AdminUser, type UserRole, type UserStatus } from "./types";

export const toRole = (v: string): UserRole =>
  (ROLES as readonly string[]).includes(v) ? (v as UserRole) : "user";
export const toUserStatus = (v: string): UserStatus =>
  (STATUSES as readonly string[]).includes(v) ? (v as UserStatus) : "inactive";

export const toAdminUser = (d: AdminUserDto): AdminUser => ({
  id: d.id,
  phoneNumber: d.phoneNumber,
  role: toRole(d.role),
  status: toUserStatus(d.status),
  createdAt: d.createdAt,
});
