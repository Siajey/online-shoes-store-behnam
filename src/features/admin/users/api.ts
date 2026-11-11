import { api, type Page } from "@/lib/api";
import type { AdminUsersPageDto } from "./dto";
import { toAdminUser } from "./mappers";
import type { AdminUser, UserFilters, UserRole, UserStatus } from "./types";

const filterQuery = (f: UserFilters) => ({
  role: f.role,
  status: f.status,
  phoneNumber: f.phoneNumber,
});

export async function fetchAdminUsers(
  filters: UserFilters = {},
  opts: { cursor?: string; limit?: number; signal?: AbortSignal } = {},
): Promise<Page<AdminUser>> {
  const res = await api.get<AdminUsersPageDto>("/users", {
    query: {
      ...filterQuery(filters),
      nextCursor: opts.cursor,
      pageSize: opts.limit,
      sort: "createdAt:desc",
    },
    signal: opts.signal,
  });
  return { items: res.data.users.map(toAdminUser), nextCursor: res.data.nextCursor ?? null };
}

/** تعداد کل کاربران با همین فیلترها (data خودِ عدد است). */
export async function countAdminUsers(
  filters: UserFilters = {},
  signal?: AbortSignal,
): Promise<number> {
  const res = await api.get<number>("/users/count", { query: filterQuery(filters), signal });
  return typeof res.data === "number" ? res.data : 0;
}

export async function updateAdminUser(
  id: string,
  patch: { role?: UserRole; status?: UserStatus },
): Promise<void> {
  await api.patch(`/users/${encodeURIComponent(id)}`, { body: patch });
}
