export type NavItem = { label: string; href: string };

/** ناوبری اصلی هدر دسکتاپ. مسیرها و پارامترهای فیلتر موقت‌اند تا قرارداد API نهایی شود. */
export const mainNav: NavItem[] = [
  { label: "خانه", href: "/" },
  { label: "محصولات", href: "/products" },
  { label: "مردانه", href: "/products?category=men" },
  { label: "زنانه", href: "/products?category=women" },
  { label: "تخفیف‌ها", href: "/products?discount=true" },
];

export const footerGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "فروشگاه",
    items: [
      { label: "همه‌ی محصولات", href: "/products" },
      { label: "مردانه", href: "/products?category=men" },
      { label: "زنانه", href: "/products?category=women" },
      { label: "تخفیف‌ها", href: "/products?discount=true" },
    ],
  },
  {
    title: "پشتیبانی",
    items: [
      { label: "راهنمای سایز", href: "/size-guide" },
      { label: "رویه‌ی بازگشت کالا", href: "/returns" },
      { label: "پیگیری سفارش", href: "/account/orders" },
      { label: "سؤالات متداول", href: "/faq" },
    ],
  },
];
