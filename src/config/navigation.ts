export type NavItem = { label: string; href: string };

/** ناوبری اصلی هدر دسکتاپ. slugها از نمونه‌ی واقعی /categories آمده‌اند. */
export const mainNav: NavItem[] = [
  { label: "خانه", href: "/" },
  { label: "محصولات", href: "/products" },
  { label: "مردانه", href: "/products?category=mens-shoes" },
  { label: "زنانه", href: "/products?category=womens-shoes" },
  { label: "تخفیف‌ها", href: "/products?discount=true" },
];

export const footerGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "فروشگاه",
    items: [
      { label: "همه‌ی محصولات", href: "/products" },
      { label: "مردانه", href: "/products?category=mens-shoes" },
      { label: "زنانه", href: "/products?category=womens-shoes" },
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
      { label: "درباره‌ی ما", href: "/about" },
      { label: "راه‌های ارتباطی", href: "/contact" },
      { label: "قوانین و مقررات", href: "/terms" },
      { label: "حریم خصوصی", href: "/privacy" },
    ],
  },
];
