/** عنصر GET /users (فقط ستون‌های USER_SELECT؛ پروفایل در فهرست نیست). */
export type AdminUserDto = {
  id: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

/** data در GET /users؛ کلید فهرست «users» است (نه items مثل محصولات). */
export type AdminUsersPageDto = {
  users: AdminUserDto[];
  length: number;
  nextCursor: string | null;
};
