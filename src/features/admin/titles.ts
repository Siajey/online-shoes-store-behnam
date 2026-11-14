import { adminCopy } from "./copy";

/** عنوان نوار بالای پنل بر اساس مسیر. */
export function adminTitle(pathname: string | null): string {
  if (!pathname) return adminCopy.title;
  if (pathname === "/admin/products/new") return adminCopy.titles.productNew;
  if (pathname.startsWith("/admin/products/")) return adminCopy.titles.productEdit;
  if (pathname.startsWith("/admin/products")) return adminCopy.nav.products;
  if (pathname.startsWith("/admin/categories")) return adminCopy.nav.categories;
  if (pathname.startsWith("/admin/brands")) return adminCopy.nav.brands;
  if (pathname.startsWith("/admin/users")) return adminCopy.nav.users;
  return adminCopy.title;
}
