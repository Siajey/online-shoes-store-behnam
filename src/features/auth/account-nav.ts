import { authCopy as t } from "./copy";

export type AccountKey = "summary" | "profile" | "addresses" | "orders" | "favourites" | "security";

export const ACCOUNT_LINKS: readonly {
  key: AccountKey;
  href: string;
  label: string;
  text: string;
}[] = [
  { key: "summary", href: "/account", label: t.navSummary, text: t.accountSoon },
  { key: "profile", href: "/account/profile", label: t.navProfile, text: t.navProfileText },
  { key: "addresses", href: "/account/addresses", label: t.navAddresses, text: t.navAddressesText },
  { key: "orders", href: "/account/orders", label: t.navOrders, text: t.navOrdersText },
  { key: "favourites", href: "/favourites", label: t.navFavourites, text: t.navFavouritesText },
  { key: "security", href: "/account/security", label: t.navSecurity, text: t.navSecurityText },
];

/** لینک‌هایی که در فهرست منوی خلاصه می‌آیند (خود «خلاصه» نه). */
export const MENU_LINKS = ACCOUNT_LINKS.filter((l) => l.key !== "summary");
