import { toPersianDigits } from "@/lib/format";

export const heroCopy = {
  carouselLabel: "بنرهای فروشگاه",
  asideLabel: "پیشنهادهای ویژه",
  secondaryCta: "دیدن همه‌ی دسته‌ها",
  secondaryHref: "#categories",
  next: "اسلاید بعدی",
  prev: "اسلاید قبلی",
  goTo: (n: number) => `رفتن به اسلاید ${toPersianDigits(n)}`,
  shoeAlt: "تصویر کفش ورزشی",
} as const;
