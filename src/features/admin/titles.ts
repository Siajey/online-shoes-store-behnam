import { adminCopy } from "./copy";

/** عنوان نوار بالای پنل بر اساس مسیر. */
export function adminTitle(pathname: string | null): string {
  if (!pathname) return adminCopy.title;
  if (pathname === "/admin/products/new") return adminCopy.titles.productNew;
  if (pathname.startsWith("/admin/products/")) return adminCopy.titles.productEdit;
  if (pathname.startsWith("/admin/products")) return adminCopy.nav.products;
  if (pathname.startsWith("/admin/categories")) return adminCopy.nav.categories;
  if (pathname.startsWith("/admin/brands")) return adminCopy.nav.brands;
  if (pathname === "/admin/discounts/new") return adminCopy.titles.discountNew;
  if (pathname.startsWith("/admin/discounts/")) return adminCopy.titles.discountEdit;
  if (pathname.startsWith("/admin/discounts")) return adminCopy.nav.discounts;
  if (pathname === "/admin/coupons/new") return adminCopy.titles.couponNew;
  if (pathname.startsWith("/admin/coupons/")) return adminCopy.titles.couponEdit;
  if (pathname.startsWith("/admin/coupons")) return adminCopy.nav.coupons;
  if (pathname.startsWith("/admin/users")) return adminCopy.nav.users;
  return adminCopy.title;
}
